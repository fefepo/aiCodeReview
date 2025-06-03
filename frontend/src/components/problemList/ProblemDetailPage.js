import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { jwtDecode } from "jwt-decode";
import { io } from "socket.io-client";
import "./ProblemDetailPage.css";

function ProblemDetailPage() {
    const { id } = useParams(); // ✅ URL에서 문제 ID 가져오기
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [code, setCode] = useState(""); // ✅ 코드 입력 값
    const [submissionId, setSubmissionId] = useState(null); // ✅ 제출된 코드 ID 저장
    const [gradingResult, setGradingResult] = useState(""); // ✅ 채점 결과 저장
    const [aiResult, setAiResult] = useState({ thinking: "", improvements: "" }); // ✅ AI 분석 결과
    const [userId, setUserId] = useState(null); // ✅ JWT에서 가져온 사용자 ID
    const [isProcessing, setIsProcessing] = useState(false); // 버튼 비활성화 상태
    const [activeTab, setActiveTab] = useState("grading");
    const [isThinkingVisible, setIsThinkingVisible] = useState(true); // 생각 과정 표시 여부
    const socketRef = useRef(null); // ✅ 소켓 참조용 useRef
    const streamModeRef = useRef({ isThinking: false }); // ✅ 스트리밍 모드 상태 추적

    const [pylintResult, setPylintResult] = useState(null); // pylint 결과 상태 변수 추가


    // ✅ JWT 토큰에서 userId 가져오기
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserId(decodedToken.userId);
        }
    }, []);

    // ✅ API 호출하여 문제 상세 정보 가져오기
    useEffect(() => {
        const fetchProblemDetail = async () => {
            try {
                const response = await fetch(`http://localhost:8080/problems/${id}`);
                if (!response.ok) {
                    throw new Error("문제 정보를 불러오는 데 실패했습니다.");
                }
                const data = await response.json();
                setProblem(data);
                // 문제 데이터를 불러온 후 기본 활성 탭 설정
                setActiveTab("grading"); // 기본 탭은 항상 채점으로 시작
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProblemDetail();
    }, [id]);

    // ✅ WebSocket 연결
    useEffect(() => {
        const socket = io("localhost:8888", { // 🔁 Python 서버 주소에 맞게 수정
            transports: ["websocket"],  // ✅ WebSocket만 사용
        });

        socketRef.current = socket; // ✅ 소켓 저장

        socket.on("connect", () => {
            console.log("🟢 WebSocket connected");
        });

        // 요청 처리 중 알림
        socket.on("processing", (data) => {
            if (data.status === "started") {
                setAiResult({ thinking: "", improvements: "⏳ " + data.message }); // ex: "⏳ Processing your code..."
                setIsProcessing(true);
                // 스트리밍 상태 초기화
                streamModeRef.current = { isThinking: false };
            }
        });

        // predict_response 처리 - 새로운 응답 형식에 맞게 수정
        socket.on("predict_response", (data) => {
            setIsProcessing(false);

            if (data.status === "success") {
                // 새로운 형식에 맞게 처리
                setAiResult({
                    thinking: data.thinking || "",
                    improvements: data.improvements || ""
                });
            } else if (data.status === "error") {
                alert(`❌ 오류 발생: ${data.error}`); // 화면 알림으로 띄움
            } else {
                setAiResult({ thinking: "", improvements: "⚠️ 알 수 없는 응답 형식입니다." });
            }
        });

        // token_stream: 토큰 단위 스트리밍 처리 (개선된 버전)
        socket.on("token_stream", (data) => {
            if (data.status === "streaming") {
                setAiResult(prev => {
                    // 스트리밍되는 토큰 텍스트
                    let token = data.token;

                    // 지시문 패턴 확인 및 제거
                    const instructionPattern = /###Instruction###.*?<｜Assistant｜>/s;
                    if (instructionPattern.test(token)) {
                        token = token.replace(instructionPattern, "");
                    }

                    // 현재 생각 모드 상태 가져오기
                    let isThinking = streamModeRef.current.isThinking;

                    // 토큰 처리 로직 개선
                    let updatedThinking = prev.thinking;
                    let updatedImprovements = prev.improvements;

                    // <think> 태그 확인 및 처리
                    if (token.includes("<think>")) {
                        isThinking = true;
                        streamModeRef.current.isThinking = true;

                        // <think> 태그 이전 부분은 improvements에 추가
                        const parts = token.split("<think>");
                        if (parts[0] && parts[0].trim() !== "") {
                            updatedImprovements = updatedImprovements === getLoadingMessage() ? parts[0] : updatedImprovements + parts[0];
                        }

                        // <think> 태그 이후 부분은 thinking에 추가
                        if (parts[1]) {
                            updatedThinking += parts[1];
                        }
                    }
                    // </think> 태그 확인 및 처리
                    else if (token.includes("</think>")) {
                        isThinking = false;
                        streamModeRef.current.isThinking = false;

                        // </think> 태그 이전 부분은 thinking에 추가
                        const parts = token.split("</think>");
                        if (parts[0]) {
                            updatedThinking += parts[0];
                        }

                        // </think> 태그 이후 부분은 improvements에 추가
                        if (parts[1]) {
                            updatedImprovements = updatedImprovements === getLoadingMessage() ? parts[1] : updatedImprovements + parts[1];
                        }
                    }
                    // 일반 토큰 처리
                    else {
                        // 생각 모드일 때는 thinking에 추가
                        if (isThinking) {
                            updatedThinking += token;
                        }
                        // 개선 모드일 때는 improvements에 추가
                        else {
                            // 초기 로딩 메시지 대체
                            if (updatedImprovements === getLoadingMessage()) {
                                updatedImprovements = token;
                            } else {
                                updatedImprovements += token;
                            }
                        }
                    }

                    // 태그 정리 (완료했을 때만)
                    if (data.is_end) {
                        updatedThinking = updatedThinking.replace(/<\/?think>/g, "");
                        updatedImprovements = updatedImprovements.replace(/<\/?think>/g, "");

                        if (updatedImprovements === getLoadingMessage()) {
                            updatedImprovements = "결과가 제공되지 않았습니다.";
                        }
                    }

                    return {
                        thinking: updatedThinking,
                        improvements: updatedImprovements
                    };
                });

                // 스트리밍 완료시 처리
                if (data.is_end) {
                    setIsProcessing(false);
                    // 스트리밍 상태 초기화
                    streamModeRef.current = { isThinking: false };
                }
            }
        });

        socket.on("disconnect", () => {
            console.log("🔴 WebSocket disconnected");
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    // 문제 유형에 따른 메시지 반환
    const getLoadingMessage = () => {
        if (!problem) return "⏳ 요청 처리 중...";

        switch (problem.option) {
            case 0:
                return "⏳ AI 개선 요청 중...";
            case 1:
                return "⏳ 알고리즘 분석 중...";
            default:
                return "⏳ 요청 처리 중...";
        }
    };

    // 문제 유형에 따른 버튼 텍스트 반환
    const getButtonText = () => {
        if (!problem) return "AI 요청";

        switch (problem.option) {
            case 0:
                return "AI 개선 요청";
            case 1:
                return "알고리즘 분석";
            default:
                return "AI 개선 요청";
        }
    };

    // 문제 유형에 따른 탭 텍스트 반환
    const getTabText = () => {
        if (!problem) return "AI 분석 결과";

        switch (problem.option) {
            case 0:
                return "AI 분석 결과";
            case 1:
                return "알고리즘 분석";
            default:
                return "AI 분석 결과";
        }
    };

    // ✅ 서버로 predict_streaming 요청 보내기
    const handleAiRequest = () => {
        if (!code.trim()) {
            setAiResult({ thinking: "", improvements: "⚠️ 코드를 입력하세요." });
            return;
        }

        // 형식화된 prompt 생성 - Question : description과 constraints, Answer : code
        const question = `Question: ${problem.description}${problem.constraints ? '\n' + problem.constraints : ''}`;

        const requestData = {
            question: question,
            prompt: code,
            option: problem ? problem.option : 0  // 문제 유형에 따라 option 값 설정
        };

        socketRef.current.emit("predict_streaming", requestData);
        setAiResult({ thinking: "", improvements: getLoadingMessage() });
        // AI 탭으로 전환
        setActiveTab("ai");
    };

    // Pylint 결과 포맷팅
    const formatPylintOutput = (output) => {
        if (!output) return 'Pylint 결과가 없습니다.';
        const cleanedOutput = output
            .split('\n')
            .filter(
                (line) =>
                    !line.includes('DeprecationWarning') &&
                    !line.startsWith('************* Module') &&
                    !line.includes('(pylint_stdout, _) = lint.py_run(file_path, return_std=True)')
            );

        const formattedOutput = cleanedOutput
            .map((line) => {
                let updatedLine = line.replace(/.*\\Temp\\[^\\]+\.py:(\d+):/, 'py:$1:');
                updatedLine = updatedLine.replace(/(convention|warning|error) \(([^,]+), ([^)]+)\)/, '($2, $3)');
                const match = updatedLine.match(/^(py:\d+: \([^)]*\))\s*(.*)/);
                if (match) {
                    const message = match[1];
                    const description = match[2];
                    return `<span class="sc-highlight">${message}</span>\n<span class="sc-bold">${description}</span>\n`;
                } else {
                    return `<span class="sc-bold">${updatedLine}</span>`;
                }
            })
            .join('\n\n');

        return formattedOutput.trim();
    };

    // ✅ 코드 제출 (API 요청) + Pylint 결과 추가
    const handleSubmit = async () => {
        if (!userId) {
            setGradingResult("⚠️ 로그인 후 제출해주세요.");
            return;
        }
        if (!code.trim()) {
            setGradingResult("⚠️ 코드를 입력하세요.");
            return;
        }

        try {
            setGradingResult("⏳ 코드 제출 중...");
            setPylintResult(null); // 이전 pylint 결과 초기화

            // 1. 제출 API 호출
            const response = await fetch("http://localhost:8080/submissions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    problemId: problem.id,
                    userId: userId,
                    code: code,
                    language: "Python"
                })
            });

            if (!response.ok) throw new Error("코드 제출 실패");

            const data = await response.json();
            setSubmissionId(data.id);
            setGradingResult(`✅ 코드 제출 완료! 채점 ID: ${data.id}`);

            // 2. pylint 분석 결과 호출
            const pylintRes = await fetch("http://localhost:8080/pylint/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code })
            });

            if (pylintRes.ok) {
                const pylintData = await pylintRes.json();
                // Pylint 결과 포맷팅 후 상태에 저장
                const formattedPylintOutput = formatPylintOutput(pylintData.output);
                setPylintResult({
                    ...pylintData,
                    formattedOutput: formattedPylintOutput // 포맷팅된 결과를 저장
                });
            } else {
                setPylintResult({ output: "❌ Pylint 분석 실패", score: 0 });
            }

            setActiveTab("grading");
        } catch (err) {
            setGradingResult(`❌ 제출 오류: ${err.message}`);
        }
    };


    // ✅ 코드 채점 (API 요청)
    const handleExecute = async () => {
        if (!submissionId) {
            setGradingResult("⚠️ 먼저 코드를 제출하세요.");
            return;
        }

        try {
            setGradingResult("⏳ 채점 중...");
            const response = await fetch(`http://localhost:8080/submissions/${submissionId}/execute`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}` // ✅ JWT 포함
                }
            });

            if (!response.ok) throw new Error("채점 실행 실패");

            const resultData = await response.text(); // 문자열 응답을 직접 가져옴
            setGradingResult(`✅ 실행 결과: ${resultData}`);
            // 채점 탭으로 전환
            setActiveTab("grading");
        } catch (err) {
            setGradingResult(`❌ 채점 오류: ${err.message}`);
        }
    };

    // 생각 과정 표시 토글
    const toggleThinking = () => {
        setIsThinkingVisible(!isThinkingVisible);
    };

    // 결과 섹션의 제목 반환
    const getResultSectionTitle = () => {
        if (!problem) return "✅ 결과";

        switch (problem.option) {
            case 0:
                return "✅ 개선된 코드";
            case 1:
                return "✅ 알고리즘 분석";
            default:
                return "✅ 개선된 코드";
        }
    };

    // 알고리즘 분석 문제인지 확인하는 함수
    const isAlgorithmAnalysis = () => {
        return problem && problem.option === 1;
    };

    if (loading) return <p>문제 정보를 불러오는 중...</p>;
    if (error) return <p>오류 발생: {error}</p>;

    return (
        <div className="problem-detail-container">
            {/* 상단 문제 제목 및 설명 */}
            <div className="problem-header">
                <h2>{problem.title}</h2>
                <p>{problem.description}</p>
            </div>

            <div className="main-layout">
                {/* 코드 입력 및 실행 영역 */}
                <div className="editor-container">
                    <div className="scp-form-group">
                        <label htmlFor="source-code">소스 코드</label>
                        <CodeMirror
                            value={code}
                            extensions={[python()]}
                            onChange={(value) => setCode(value)}
                            className="scp-code-input"
                        />
                    </div>
                    <div className="code-actions">
                        {(!problem || problem.option !== 1) && (
                            <>
                                <button className="btn-submit" onClick={handleSubmit}>제출</button>
                                <button className="btn-run" onClick={handleExecute}>채점</button>
                            </>
                        )}
                        <button className="btn-reset" onClick={() => setCode("")}>초기화</button>
                        <button className="btn-ai" onClick={handleAiRequest} disabled={isProcessing}>{getButtonText()}</button>
                    </div>

                    {/* 알고리즘 분석 문제가 아닐 때만 테스트 케이스 표시 */}
                    {!isAlgorithmAnalysis() && (
                        <div className="test-case">
                            <h3>예제 입력</h3>
                            <pre>{problem.inputExamples.join("\n")}</pre>
                            <h3>예제 출력</h3>
                            <pre>{problem.outputExamples.join("\n")}</pre>
                            <h3>제한 사항</h3>
                            <pre>{problem.constraints}</pre>
                        </div>
                    )}

                    {/* 알고리즘 분석 문제일 때는 제한 사항만 표시 */}
                    {isAlgorithmAnalysis() && (
                        <div className="test-case">
                            <h3>제한 사항</h3>
                            <pre>{problem.constraints}</pre>
                        </div>
                    )}
                </div>

                {/* 채점 및 분석 영역 */}
                <div className="chat-section">
                    <div className="tabs">
                        <div className="tab-buttons">
                            <button
                                className={activeTab === "grading" ? "active" : ""}
                                onClick={() => setActiveTab("grading")}
                            >
                                채점 결과
                            </button>
                            <button
                                className={activeTab === "ai" ? "active" : ""}
                                onClick={() => setActiveTab("ai")}
                            >
                                {getTabText()}
                            </button>
                        </div>
                        <div className="tab-content">
                            {activeTab === "grading" ? (
                                <div className="chat-box">
                                    {gradingResult || "코드 채점 결과가 표시됩니다."}

                                    {gradingResult && (
                                        <div className="pylint-section">
                                            <h4>🧪 Pylint 분석 결과</h4>
                                            {pylintResult ? (
                                                <>
                                                    <p><strong>점수:</strong> {pylintResult.score} / 10</p>
                                                    <div
                                                        className="pylint-output"
                                                        dangerouslySetInnerHTML={{ __html: pylintResult.formattedOutput }}
                                                    ></div>
                                                </>
                                            ) : (
                                                <p>🔍 분석 결과를 불러오는 중이거나 아직 없습니다.</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="chat-box">
                                    {aiResult.thinking ? (
                                        <div className="thinking-section">
                                            <div className="thinking-header" onClick={toggleThinking}>
                                                <h4>🤔 생각 과정
                                                    <span className="arrow-icon">
                                                        {isThinkingVisible ?
                                                            <img src="/arrow_down.png" alt="펼치기" className="toggle-arrow" /> :
                                                            <img src="/arrow_up.png" alt="접기" className="toggle-arrow" />
                                                        }
                                                    </span>
                                                </h4>
                                            </div>
                                            {isThinkingVisible && (
                                                <div className="thinking-content">
                                                    {aiResult.thinking}
                                                </div>
                                            )}
                                        </div>
                                    ) : null}

                                    {aiResult.improvements && aiResult.improvements !== getLoadingMessage() ? (
                                        <div className="improvements-section">
                                            <h4>{getResultSectionTitle()}</h4>
                                            <div className="improvements-content">{aiResult.improvements}</div>
                                        </div>
                                    ) : null}

                                    {!aiResult.thinking && (!aiResult.improvements || aiResult.improvements === getLoadingMessage()) && (
                                        <div className="loading-message">
                                            {aiResult.improvements || `${getTabText()} 표시됩니다.`}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProblemDetailPage;