import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import '../createProblem/CreateProblemPage.css';

// ==================== 메인 컴포넌트 ====================
function EditProblemPage() {
    // ==================== URL 파라미터 및 상태 관리 ====================
    const { problemId } = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [inputExamples, setInputExamples] = useState(['']);
    const [outputExamples, setOutputExamples] = useState(['']);
    const [constraints, setConstraints] = useState('');
    const [option, setOption] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // ==================== AI 테스트 케이스 생성 관련 상태 ====================
    const [isGeneratingTestCases, setIsGeneratingTestCases] = useState(false);
    const [generatedTestCases, setGeneratedTestCases] = useState('');
    const [timeoutId, setTimeoutId] = useState(null);

    // ==================== 규칙 관련 상태 ====================
    const [rules, setRules] = useState([]);
    const [selectedRule, setSelectedRule] = useState(null);

    // ==================== Socket.io 연결 관리 ====================
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);

    // ==================== 규칙 목록 불러오기 ====================
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

    // ==================== Socket.io 연결 설정 및 이벤트 처리 ====================
    useEffect(() => {
        // Socket.io 연결 초기화
        socketRef.current = io('https://d5c5-39-125-143-248.ngrok-free.app', {
            transports: ['websocket'],
        });

        // 연결 상태 이벤트 핸들러
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

        // AI 응답 처리
        socketRef.current.on('predict_response', (response) => {
            try {
                // 타임아웃 정리
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

        // 컴포넌트 언마운트 시 정리
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, []);

    // ==================== 기존 문제 데이터 불러오기 ====================
    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const response = await fetch(`http://localhost:8080/problems/${problemId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) throw new Error('문제 정보를 불러오는 데 실패했습니다.');

                const data = await response.json();
                setTitle(data.title);
                setDescription(data.description);
                setInputExamples(data.inputExamples || ['']);
                setOutputExamples(data.outputExamples || ['']);
                setConstraints(data.constraints || '');
                setOption(data.option || 0);

                // 기존 규칙 정보 복원
                if (data.rule && data.ruleDetail) {
                    setSelectedRule({
                        title: data.rule,
                        description: data.ruleDetail
                    });
                }
            } catch (err) {
                setErrorMessage(`❌ ${err.message}`);
            }
        };

        fetchProblem();
    }, [problemId]);

    // ==================== 입출력 예제 핸들러 ====================
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

    const handleAddInput = () => setInputExamples([...inputExamples, '']);
    const handleAddOutput = () => setOutputExamples([...outputExamples, '']);

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

    // ==================== 테스트 케이스 파싱 및 적용 ====================
    const parseAndAddTestCases = (testCaseText) => {
        console.log('응답 : ', testCaseText);
        // AI 응답에서 테스트 케이스 추출을 위한 정규표현식
        const testCaseRegex = /## Test Case \d+[\s\n]*\*\*Input:\*\*[\s\n]*([\s\S]*?)[\s\n]*\*\*Expected Output:\*\*[\s\n]*([\s\S]*?)(?:\n## Test Case|\n\n|\s*$)/g;

        let newInputs = [];
        let newOutputs = [];
        let matchCount = 0;
        let match;

        while ((match = testCaseRegex.exec(testCaseText)) !== null) {
            matchCount++;
            const input = match[1].trim().replace(/,/g, ' ');
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

    // ==================== 제한사항 플레이스홀더 텍스트 ====================
    const getConstraintsPlaceholder = () => {
        return (option === 0 || option === 4)
            ? "예: 입력값은 -1000 이상 1000 이하의 정수입니다."
            : "예: 알고리즘을 5단계로 나눠서 작성하세요.";
    };

    // ==================== 문제 수정 제출 ====================
    const handleSubmit = async () => {
        setErrorMessage('');
        setSuccessMessage('');

        // 코드 제출용 문제의 경우 입출력 개수 검증
        if ((option === 0 || option === 4) && inputExamples.length !== outputExamples.length) {
            const minLength = Math.min(inputExamples.length, outputExamples.length);
            setInputExamples(inputExamples.slice(0, minLength));
            setOutputExamples(outputExamples.slice(0, minLength));
            setErrorMessage('⚠️ 입력과 출력 개수가 다릅니다. 맞춰주세요.');
            return;
        }

        const body = {
            title,
            description,
            inputExamples: (option === 0 || option === 4) ? inputExamples : [],
            outputExamples: (option === 0 || option === 4) ? outputExamples : [],
            constraints,
            option: parseInt(option),
            rule: selectedRule?.title || '',
            ruleDetail: selectedRule?.description || ''
        };

        try {
            const response = await fetch(`http://localhost:8080/problems/${problemId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!response.ok) throw new Error('문제 수정에 실패했습니다.');
            const result = await response.json();
            setSuccessMessage(`✅ '${result.title}' 문제 수정이 완료되었습니다.`);
        } catch (error) {
            setErrorMessage(`❌ ${error.message}`);
        }
    };

    // ==================== 렌더링 ====================
    return (
        <div className="cp-container">
            <h1 className="cp-title">문제 수정</h1>

            {/* 문제 유형별 안내 메시지 */}
            {(option === 0 || option === 4) && (
                <div className="cp-label2">✅ 여러개의 입력을 받을 시, 스페이스바로 구분하여 입력하시오. (10과 20을 입력받아야 할 경우 "10 20")</div>
            )}
            {(option === 0 || option === 4) && (
                <div className="cp-label2">✅ 테스트 케이스 생성 버튼을 클릭하면 AI가 문제에 맞는 입력 예제, 출력 예제를 자동으로 생성합니다.</div>
            )}
            {(option === 0 || option === 4) && (
                <div className="cp-label2">✅ 문제 유형을 변경하여 원하는 문제를 만드세요!</div>
            )}
            {option === 1 && (
                <div className="cp-label2">✅ 알고리즘 풀이를 프로그래밍 언어가 아닌 한글로 풀 수 있습니다.</div>
            )}

            <div className="cp-form">
                {/* 제목 입력 */}
                <label className="cp-label">제목</label>
                <input
                    className="cp-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="문제 제목"
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

                {/* 문제 설명 */}
                <label className="cp-label">설명</label>
                <textarea
                    className="cp-textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="문제 설명"
                />

                {/* 제한사항 */}
                <label className="cp-label">제한사항</label>
                <textarea
                    className="cp-textarea"
                    value={constraints}
                    onChange={(e) => setConstraints(e.target.value)}
                    placeholder={getConstraintsPlaceholder()}
                />

                {/* AI 테스트 케이스 생성 버튼 */}
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

                {/* 입출력 예제 (코드 제출용 문제만) */}
                {(option === 0 || option === 4) && (
                    <>
                        <label className="cp-label">입력 예제</label>
                        {inputExamples.map((input, i) => (
                            <input
                                key={i}
                                className="cp-input"
                                value={input}
                                onChange={(e) => handleInputChange(i, e.target.value, 'input')}
                                placeholder={`입력 예제 ${i + 1}`}
                            />
                        ))}
                        <button className="cp-add-button" onClick={handleAddInput}>+ 입력 추가</button>

                        <label className="cp-label">출력 예제</label>
                        {outputExamples.map((output, i) => (
                            <input
                                key={i}
                                className="cp-input"
                                value={output}
                                onChange={(e) => handleInputChange(i, e.target.value, 'output')}
                                placeholder={`출력 예제 ${i + 1}`}
                            />
                        ))}
                        <button className="cp-add-button" onClick={handleAddOutput}>+ 출력 추가</button>
                    </>
                )}

                {/* 상태 메시지 */}
                {errorMessage && <p className="cp-error">{errorMessage}</p>}
                {successMessage && <p className="cp-success">{successMessage}</p>}

                {/* 제출 버튼 */}
                <button className="cp-submit" onClick={handleSubmit} disabled={!title || !description}>
                    문제 수정
                </button>
            </div>
        </div>
    );
}

export default EditProblemPage;