import React, { useState, useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import { io } from 'socket.io-client';
import './CreateProblemPage.css';

function CreateProblemPage() {
    // ==================== 상태 관리 ====================
    // 문제 기본 정보
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [inputExamples, setInputExamples] = useState(['']);
    const [outputExamples, setOutputExamples] = useState(['']);
    const [constraints, setConstraints] = useState('');
    const [option, setOption] = useState(0); // 0: 코드 제출용, 1: 알고리즘 로직 분석용

    // UI 상태
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [userId, setUserId] = useState('');

    // AI 테스트 케이스 생성
    const [isGeneratingTestCases, setIsGeneratingTestCases] = useState(false);
    const [generatedTestCases, setGeneratedTestCases] = useState('');
    const [timeoutId, setTimeoutId] = useState(null);

    // 규칙 관리
    const [rules, setRules] = useState([]);
    const [selectedRule, setSelectedRule] = useState(null);

    // ==================== 규칙 데이터 로드 ====================
    // 컴포넌트 마운트 시 승인된 규칙 목록을 서버에서 가져옴
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

    // ==================== WebSocket 연결 관리 ====================
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);

    // Socket.io 연결 설정 및 이벤트 리스너 등록
    useEffect(() => {
        // Socket.io 연결 설정
        socketRef.current = io('https://9813-39-125-143-248.ngrok-free.app', {
            transports: ['websocket'],
        });

        // 연결 이벤트 처리
        socketRef.current.on('connect', () => {
            console.log('🟢 WebSocket connected');
            setIsConnected(true);
        });

        socketRef.current.on('connect_error', (error) => {
            console.error('Socket.io 연결 오류:', error);
            setErrorMessage('AI 서버 연결에 실패했습니다.');
        });

        socketRef.current.on('disconnect', () => {
            console.log('🔴 WebSocket disconnected');
            setIsConnected(false);
        });

        // AI 서버 응답 처리
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

        // 정리 작업
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, []);

    // ==================== 사용자 인증 ====================
    // JWT 토큰에서 사용자 ID 추출
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

    // ==================== 예제 입출력 관리 ====================
    const handleAddInputExample = () => {
        setInputExamples([...inputExamples, '']);
    };

    const handleAddOutputExample = () => {
        setOutputExamples([...outputExamples, '']);
    };

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

    // ==================== AI 테스트 케이스 생성 ====================
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

        // 타임아웃 설정 (10분)
        const newTimeoutId = setTimeout(() => {
            setIsGeneratingTestCases(false);
            setErrorMessage('테스트 케이스 생성 요청이 시간 초과되었습니다. 나중에 다시 시도해주세요.');
            setTimeoutId(null);
        }, 600000);

        setTimeoutId(newTimeoutId);

        // AI 서버로 요청 전송
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

    // ==================== 테스트 케이스 파싱 ====================
    // AI 생성 텍스트를 입력/출력 예제로 분리
    const parseAndAddTestCases = (testCaseText) => {
        console.log('응답 : ', testCaseText);

        // 정규표현식: ## Test Case + **Input:** + **Expected Output:** 패턴 매칭
        const testCaseRegex = /## Test Case \d+[\s\n]*\*\*Input:\*\*[\s\n]*([\s\S]*?)[\s\n]*\*\*Expected Output:\*\*[\s\n]*([\s\S]*?)(?:\n## Test Case|\n\n|\s*$)/g;

        let newInputs = [];
        let newOutputs = [];
        let matchCount = 0;
        let match;

        while ((match = testCaseRegex.exec(testCaseText)) !== null) {
            matchCount++;
            const input = match[1].trim().replace(/,/g, ' '); // 쉼표를 공백으로 변환
            const output = match[2].trim();

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

    // ==================== 문제 생성 및 제출 ====================
    const handleSubmit = async () => {
        setErrorMessage('');
        setSuccessMessage('');

        // 입출력 개수 일치 확인
        if ((option === 0 || option === 4) && inputExamples.length !== outputExamples.length) {
            setErrorMessage("⚠️ 입력과 출력의 개수가 맞지 않습니다. 불필요한 입력 또는 출력을 삭제합니다.");
            const minLength = Math.min(inputExamples.length, outputExamples.length);
            setInputExamples(inputExamples.slice(0, minLength));
            setOutputExamples(outputExamples.slice(0, minLength));
            return;
        }

        const requestBody = {
            title,
            description,
            inputExamples: (option === 0 || option === 4) ? inputExamples : [],
            outputExamples: (option === 0 || option === 4) ? outputExamples : [],
            constraints,
            createdBy: userId,
            option: parseInt(option),
            rule: selectedRule?.title || '',
            ruleDetail: selectedRule?.description || ''
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

            // 폼 초기화
            setTitle('');
            setDescription('');
            setInputExamples(['']);
            setOutputExamples(['']);
            setConstraints('');
            setOption(0);
            setGeneratedTestCases('');
            setSelectedRule(null);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    // ==================== UI 헬퍼 함수 ====================
    // 문제 유형에 따라 제한사항 placeholder 텍스트 결정
    const getConstraintsPlaceholder = () => {
        return (option === 0 || option === 4)
            ? "예: 입력값은 -1000 이상 1000 이하의 정수입니다."
            : "예: 알고리즘을 5단계로 나눠서 작성하세요.";
    };

    // ==================== 렌더링 ====================
    return (
        <div className="cp-container">
            <h1 className="cp-title">문제 생성</h1>

            {/* 안내 메시지 - 코드 제출용/알고리즘 분석용일 때만 표시 */}
            {(option === 0 || option === 4) && (
                <>
                    <div className="cp-label2">✅ 여러개의 입력을 받을 시, 스페이스바로 구분하여 입력하시오. (10과 20을 입력받아야 할 경우 "10 20")</div>
                    <div className="cp-label2">✅ 테스트 케이스 생성 버튼을 클릭하면 AI가 문제에 맞는 입력 예제, 출력 예제를 자동으로 생성합니다.</div>
                    <div className="cp-label2">✅ 문제 유형을 변경하여 원하는 문제를 만드세요!</div>
                </>
            )}

            {/* 알고리즘 로직 분석용 안내 메시지 */}
            {option === 1 && (
                <div className="cp-label2">✅ 알고리즘 풀이를 프로그래밍 언어가 아닌 한글로 풀 수 있습니다.</div>
            )}

            <div className="cp-form">
                {/* 문제 제목 입력 */}
                <label className="cp-label">제목</label>
                <input
                    type="text"
                    className="cp-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="문제 제목을 입력하세요"
                />

                {/* 문제 유형 선택 */}
                <label className="cp-label">문제 유형</label>
                <select
                    className="cp-select"
                    value={option}
                    onChange={(e) => setOption(parseInt(e.target.value))}
                >
                    <option value={0}>코드 제출용</option>
                    <option value={1}>알고리즘 로직 분석용</option>
                    {/* <option value={4}>알고리즘 문제 분석용</option> */}
                </select>

                {/* 규칙 카테고리 선택 */}
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

                {/* 문제 설명 입력 */}
                <label className="cp-label">설명</label>
                <textarea
                    className="cp-textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="문제 설명을 입력하세요"
                />

                {/* 제한사항 입력 - 동적 placeholder */}
                <label className="cp-label">제한사항</label>
                <textarea
                    className="cp-textarea"
                    value={constraints}
                    onChange={(e) => setConstraints(e.target.value)}
                    placeholder={getConstraintsPlaceholder()}
                />

                {/* AI 테스트 케이스 생성 버튼 - 코드 제출용/알고리즘 분석용일 때만 표시 */}
                {(option === 0 || option === 4) && (
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

                {/* 입력 예제 섹션 - 코드 제출용/알고리즘 분석용일 때만 표시 */}
                {(option === 0 || option === 4) && (
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

                {/* 출력 예제 섹션 - 코드 제출용/알고리즘 분석용일 때만 표시 */}
                {(option === 0 || option === 4) && (
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

                {/* 작성자 표시 */}
                {userId && <p className="cp-user-id">🆔 작성자: {userId}</p>}

                {/* 상태 메시지 표시 */}
                {errorMessage && <p className="cp-error">{errorMessage}</p>}
                {successMessage && <p className="cp-success">{successMessage}</p>}

                {/* 문제 생성 제출 버튼 */}
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