import React, { useState, useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import { io } from 'socket.io-client';
import './CreateProblemPage.css';

function CreateProblemPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [inputExamples, setInputExamples] = useState(['']);
    const [outputExamples, setOutputExamples] = useState(['']);
    const [constraints, setConstraints] = useState('');
    const [option, setOption] = useState(0); // 기본값은 코드 제출용(0)
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [userId, setUserId] = useState('');
    const [isGeneratingTestCases, setIsGeneratingTestCases] = useState(false);
    const [generatedTestCases, setGeneratedTestCases] = useState('');
    const [timeoutId, setTimeoutId] = useState(null);

    // 규칙 추가
    const [rules, setRules] = useState([]);
    const [selectedRule, setSelectedRule] = useState(null); // rule 객체 저장

    useEffect(() => {
        const fetchRules = async () => {
            try {
                const response = await fetch('http://localhost:8080/rules/admin', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('승인된 규칙 목록을 불러오는 데 실패했습니다.');
                }

                const data = await response.json();
                setRules(data);
            } catch (err) {
                console.error('❌ 규칙 불러오기 오류:', err.message);
            }
        };

        fetchRules();
    }, []);

    // Socket.io 연결을 위한 ref
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);

    // 컴포넌트 마운트 시 Socket.io 연결
    useEffect(() => {
        // Socket.io 연결 설정
        socketRef.current = io('https://5c54-122-35-2-20.ngrok-free.app/', {
            transports: ['websocket'],
        });

        // 연결 성공 시
        socketRef.current.on('connect', () => {
            console.log('🟢 WebSocket connected');
            setIsConnected(true);
        });

        // 연결 실패 시
        socketRef.current.on('connect_error', (error) => {
            console.error('Socket.io 연결 오류:', error);
            setErrorMessage('AI 서버 연결에 실패했습니다.');
        });

        // 연결 종료 시
        socketRef.current.on('disconnect', () => {
            console.log('🔴 WebSocket disconnected');
            setIsConnected(false);
        });

        // predict_response 이벤트 처리
        socketRef.current.on('predict_response', (response) => {
            try {
                // 타임아웃 취소
                if (timeoutId) {
                    clearTimeout(timeoutId);
                    setTimeoutId(null);
                }

                if (response.status === 'success') {
                    console.log('responce:', response);
                    console.log('받은 테스트 케이스:', response.response_text);
                    setGeneratedTestCases(response.response_text);
                    parseAndAddTestCases(response.response_text);
                    setSuccessMessage('✅ 테스트 케이스가 성공적으로 생성되었습니다!');
                } else {
                    setErrorMessage(response.error || '테스트 케이스 생성 중 오류가 발생했습니다.');
                }
                setIsGeneratingTestCases(false);
            } catch (error) {
                console.error('메시지 처리 중 오류:', error);
                setErrorMessage('서버 응답 처리 중 오류가 발생했습니다.');
                setIsGeneratingTestCases(false);
            }
        });

        // 컴포넌트 언마운트 시 Socket.io 연결 종료 및 타임아웃 제거
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, []);

    // 로그인한 유저의 ID 가져오기
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserId(decoded.sub);
            } catch (error) {
                console.error("토큰 디코딩 실패:", error);
                setUserId('');
            }
        }
    }, []);

    // 입력 추가 핸들러
    const handleAddInputExample = () => {
        setInputExamples([...inputExamples, '']);
    };

    // 출력 추가 핸들러
    const handleAddOutputExample = () => {
        setOutputExamples([...outputExamples, '']);
    };

    // 입력값 변경 핸들러
    const handleInputChange = (index, value, type) => {
        if (type === "input") {
            const updatedInputs = [...inputExamples];
            updatedInputs[index] = value;
            setInputExamples(updatedInputs);
        } else {
            const updatedOutputs = [...outputExamples];
            updatedOutputs[index] = value;
            setOutputExamples(updatedOutputs);
        }
    };

    // Socket.io를 통한 테스트 케이스 생성 요청
    const handleGenerateTestCases = () => {
        if (!isConnected) {
            setErrorMessage('AI 서버에 연결되어 있지 않습니다.');
            return;
        }

        if (!description) {
            setErrorMessage('문제 설명을 입력해주세요.');
            return;
        }

        setErrorMessage('');
        setSuccessMessage('');
        setIsGeneratingTestCases(true);

        // 타임아웃 설정
        const newTimeoutId = setTimeout(() => {
            setIsGeneratingTestCases(false);
            setErrorMessage('테스트 케이스 생성 요청이 시간 초과되었습니다. 나중에 다시 시도해주세요.');
            setTimeoutId(null);
        }, 600000); // 10분으로 변경

        setTimeoutId(newTimeoutId);

        // AI 서버로 테스트 케이스 생성 요청 전송
        const message = {
            question: description + constraints,
            option: 2 // 테스트 케이스 생성 옵션
        };

        try {
            socketRef.current.emit('predict', message);
        } catch (error) {
            console.error('메시지 전송 중 오류:', error);
            setErrorMessage('테스트 케이스 생성 요청을 보내는 데 실패했습니다.');
            setIsGeneratingTestCases(false);
            if (newTimeoutId) {
                clearTimeout(newTimeoutId);
                setTimeoutId(null);
            }
        }
    };

    // 테스트 케이스 파싱 및 추가 함수
    const parseAndAddTestCases = (testCaseText) => {
        console.log('응답 : ', testCaseText);
        // 수정된 정규표현식 적용
        const testCaseRegex = /## Test Case \d+[\s\n]*\*\*Input:\*\*[\s\n]*([\s\S]*?)[\s\n]*\*\*Expected Output:\*\*[\s\n]*([\s\S]*?)(?:\n## Test Case|\n\n|\s*$)/g;

        let newInputs = [];
        let newOutputs = [];
        let matchCount = 0;
        let match;

        while ((match = testCaseRegex.exec(testCaseText)) !== null) {
            matchCount++;
            const input = match[1].trim().replace(/,/g, ' ');
            const output = match[2].trim(); // trim()은 유지합니다.

            newInputs.push(input);
            newOutputs.push(output);
        }

        if (matchCount > 0) {
            setInputExamples(newInputs);
            setOutputExamples(newOutputs);
        } else {
            console.warn('테스트 케이스를 추출하지 못했습니다.');
        }
    };

    // 문제 생성 요청 (기존 HTTP 요청 유지)
    const handleSubmit = async () => {
        setErrorMessage('');
        setSuccessMessage('');

        if (option === 0 && inputExamples.length !== outputExamples.length) {
            setErrorMessage("⚠️ 입력과 출력의 개수가 맞지 않습니다. 불필요한 입력 또는 출력을 삭제합니다.");
            const minLength = Math.min(inputExamples.length, outputExamples.length);
            setInputExamples(inputExamples.slice(0, minLength));
            setOutputExamples(outputExamples.slice(0, minLength));
            return;
        }

        const requestBody = {
            title,
            description,
            inputExamples: option === 0 ? inputExamples : [],
            outputExamples: option === 0 ? outputExamples : [],
            constraints,
            createdBy: userId,
            option: parseInt(option),
            rule: selectedRule?.title || '',        // 규칙 제목
            ruleDetail: selectedRule?.description || '' // 규칙 설명
        };

        try {
            const response = await fetch("http://localhost:8080/problems", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error("문제 생성에 실패했습니다.");
            }

            const result = await response.json();
            setSuccessMessage(`✅ 문제 '${result.title}'이(가) 성공적으로 생성되었습니다!`);
            setTitle('');
            setDescription('');
            setInputExamples(['']);
            setOutputExamples(['']);
            setConstraints('');
            setOption(0);
            setGeneratedTestCases('');
            setSelectedRule(null); // null로 초기화
        } catch (error) {
            setErrorMessage(error.message);
        }
    };


    // 문제 유형에 따라 제한사항 placeholder 텍스트 결정
    const getConstraintsPlaceholder = () => {
        return option === 0
            ? "예: 입력값은 -1000 이상 1000 이하의 정수입니다."
            : "예: 알고리즘을 5단계로 나눠서 작성하세요.";
    };

    return (
        <div className="cp-container">
            <h1 className="cp-title">문제 생성</h1>
            {option === 0 && (
                <div className="cp-label2">✅ 여러개의 입력을 받을 시, 스페이스바로 구분하여 입력하시오. (10과 20을 입력받아야 할 경우 "10 20")</div>
            )}
            {option === 0 && (
                <div className="cp-label2">✅ 테스트 케이스 생성 버튼을 클릭하면 AI가 문제에 맞는 입력 예제, 출력 예제를 자동으로 생성합니다.</div>
            )}
            {option === 0 && (
                <div className="cp-label2">✅ 문제 유형을 변경하여 원하는 문제를 만드세요!</div>
            )}
            {option === 1 && (
                <div className="cp-label2">✅ 알고리즘 풀이를 프로그래밍 언어가 아닌 한글로 풀 수 있습니다.</div>
            )}

            <div className="cp-form">
                <label className="cp-label">제목</label>
                <input
                    type="text"
                    className="cp-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="문제 제목을 입력하세요"
                />

                {/* 문제 유형 */}
                <label className="cp-label">문제 유형</label>
                <select
                    className="cp-select"
                    value={option}
                    onChange={(e) => setOption(parseInt(e.target.value))}
                >
                    <option value={0}>코드 제출용</option>
                    <option value={1}>알고리즘 분석용</option>
                </select>

                {/* 규칙 유형 */}
                <label className="cp-label">규칙 카테고리 선택</label>
                <select
                    className="cp-select"
                    id="rule"
                    value={selectedRule?.title || ''}
                    onChange={(e) => {
                        const selected = rules.find((rule) => rule.title === e.target.value);
                        setSelectedRule(selected || null);
                    }}
                    required
                >
                    <option value="">-- 규칙을 선택하세요 --</option>
                    {rules.map((rule) => (
                        <option key={rule.id} value={rule.title}>
                            {rule.title}
                        </option>
                    ))}
                </select>

                <label className="cp-label">설명</label>
                <textarea
                    className="cp-textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="문제 설명을 입력하세요"
                />

                {/* 제한사항 - 동적 placeholder */}
                <label className="cp-label">제한사항</label>
                <textarea
                    className="cp-textarea"
                    value={constraints}
                    onChange={(e) => setConstraints(e.target.value)}
                    placeholder={getConstraintsPlaceholder()}
                />

                {/* 테스트 케이스 생성 버튼 - 코드 제출용인 경우에만 표시 */}
                {option === 0 && (
                    <div className="cp-generate-test-cases">
                        <button
                            className="cp-generate-button"
                            onClick={handleGenerateTestCases}
                            disabled={!description || isGeneratingTestCases || !isConnected}
                        >
                            <div className="cp-button-content">
                                {isGeneratingTestCases && <div className="cp-loading-spinner"></div>}
                                <span>{isGeneratingTestCases ? '생성 중...' : '테스트 케이스 생성'}</span>
                            </div>
                        </button>
                    </div>
                )}

                {/* 입력 예제 - 코드 제출용인 경우에만 표시 */}
                {option === 0 && (
                    <>
                        <label className="cp-label">입력 예제 (여러 개 입력 가능)</label>
                        {inputExamples.map((input, index) => (
                            <input
                                key={index}
                                type="text"
                                className="cp-input"
                                value={input}
                                onChange={(e) => handleInputChange(index, e.target.value, "input")}
                                placeholder={`예제 입력 ${index + 1}`}
                            />
                        ))}
                        <button className="cp-add-button" onClick={handleAddInputExample}>+ 입력 추가</button>
                    </>
                )}

                {/* 출력 예제 - 코드 제출용인 경우에만 표시 */}
                {option === 0 && (
                    <>
                        <label className="cp-label">출력 예제 (여러 개 입력 가능)</label>
                        {outputExamples.map((output, index) => (
                            <input
                                key={index}
                                type="text"
                                className="cp-input"
                                value={output}
                                onChange={(e) => handleInputChange(index, e.target.value, "output")}
                                placeholder={`예제 출력 ${index + 1}`}
                            />
                        ))}
                        <button className="cp-add-button" onClick={handleAddOutputExample}>+ 출력 추가</button>
                    </>
                )}

                {userId && <p className="cp-user-id">🆔 작성자: {userId}</p>}

                {errorMessage && <p className="cp-error">{errorMessage}</p>}
                {successMessage && <p className="cp-success">{successMessage}</p>}

                <button
                    className="cp-submit"
                    onClick={handleSubmit}
                    disabled={
                        !title ||
                        !description ||
                        (option === 0 && (inputExamples.length === 0 || outputExamples.length === 0))
                    }
                >
                    문제 생성
                </button>
            </div>
        </div>
    );
}

export default CreateProblemPage;