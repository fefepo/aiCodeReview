import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { jwtDecode } from "jwt-decode";
import { io } from "socket.io-client";
import "./ProblemDetailPage.css";

function ProblemDetailPage() {
    // ==================== URL 파라미터 ====================
    const { id } = useParams();

    // ==================== 문제 관련 상태 ====================
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ==================== 코드 에디터 상태 ====================
    const [code, setCode] = useState("");

    // ==================== 제출 및 채점 상태 ====================
    const [submissionId, setSubmissionId] = useState(null);
    const [gradingResult, setGradingResult] = useState("");
    const [pylintResult, setPylintResult] = useState(null);

    // ==================== AI 분석 상태 ====================
    const [aiResult, setAiResult] = useState({ thinking: "", improvements: "" });
    const [isProcessing, setIsProcessing] = useState(false);

    // ==================== UI 상태 ====================
    const [activeTab, setActiveTab] = useState("grading");
    const [isThinkingVisible, setIsThinkingVisible] = useState(true);

    // ==================== 사용자 인증 ====================
    const [userId, setUserId] = useState(null);

    // ==================== WebSocket 관리 ====================
    const socketRef = useRef(null);
    const streamModeRef = useRef({ isThinking: false });

    // ==================== 번역 API 설정 ====================
    const GOOGLE_TRANSLATE_API_KEY = "Google_API_KEY";

    // ==================== 번역 함수 ====================
    const translateText = async (text, targetLang = 'ko') => {
        if (!text || !text.trim()) return text;

        try {
            const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    q: text,
                    target: targetLang,
                    source: 'en'
                })
            });

            if (!response.ok) {
                console.error('번역 API 호출 실패:', response.statusText);
                return text;
            }

            const data = await response.json();
            const translatedText = data.data.translations[0].translatedText;

            // HTML 엔티티 디코딩 및 텍스트 포맷팅
            const decodedText = translatedText
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&amp;/g, '&')
                .replace(/\\n/g, '\n')
                .replace(/\. /g, '.\n')
                .replace(/: /g, ':\n')
                .replace(/\n\n+/g, '\n\n');

            return decodedText;
        } catch (error) {
            console.error('번역 중 오류 발생:', error);
            return text;
        }
    };

    // ==================== JWT 토큰 처리 ====================
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserId(decodedToken.userId);
        }
    }, []);

    // ==================== 문제 데이터 가져오기 ====================
    useEffect(() => {
        const fetchProblemDetail = async () => {
            try {
                const response = await fetch(`http://localhost:8080/problems/${id}`);
                if (!response.ok) {
                    throw new Error("문제 정보를 불러오는 데 실패했습니다.");
                }
                const data = await response.json();
                setProblem(data);
                setActiveTab("grading");
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProblemDetail();
    }, [id]);

    // ==================== WebSocket 연결 설정 ====================
    useEffect(() => {
        const socket = io("https://9813-39-125-143-248.ngrok-free.app", {
            transports: ["websocket"],
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("🟢 WebSocket connected");
        });

        // AI 처리 시작 알림
        socket.on("processing", (data) => {
            if (data.status === "started") {
                setAiResult({ thinking: "", improvements: "⏳ " + data.message });
                setIsProcessing(true);
                streamModeRef.current = { isThinking: false };
            }
        });

        // AI 분석 완료 응답 처리
        socket.on("predict_response", async (data) => {
            setIsProcessing(false);

            if (data.status === "success") {
                const translatedThinking = data.thinking ? await translateText(data.thinking) : "";
                const translatedImprovements = data.improvements ? await translateText(data.improvements) : "";

                setAiResult({
                    thinking: translatedThinking,
                    improvements: translatedImprovements
                });
            } else if (data.status === "error") {
                alert(`❌ 오류 발생: ${data.error}`);
            } else {
                setAiResult({ thinking: "", improvements: "⚠️ 알 수 없는 응답 형식입니다." });
            }
        });

        // 실시간 토큰 스트리밍 처리
        socket.on("token_stream", async (data) => {
            if (data.status === "streaming") {
                setAiResult(prev => {
                    let token = data.token;
                    let isThinking = streamModeRef.current.isThinking;

                    // 지시문 패턴 제거
                    const instructionPattern = /###Instruction###.*?<｜Assistant｜>/s;
                    if (instructionPattern.test(token)) {
                        token = token.replace(instructionPattern, "");
                    }

                    let updatedThinking = prev.thinking;
                    let updatedImprovements = prev.improvements;

                    // <think> 태그 처리 - AI의 사고 과정 구분
                    if (token.includes("<think>")) {
                        isThinking = true;
                        streamModeRef.current.isThinking = true;

                        const parts = token.split("<think>");
                        if (parts[0] && parts[0].trim() !== "") {
                            updatedImprovements = updatedImprovements === getLoadingMessage() ? parts[0] : updatedImprovements + parts[0];
                        }

                        if (parts[1]) {
                            updatedThinking += parts[1];
                        }
                    }
                    // </think> 태그 처리 - 사고 과정 종료
                    else if (token.includes("</think>")) {
                        isThinking = false;
                        streamModeRef.current.isThinking = false;

                        const parts = token.split("</think>");
                        if (parts[0]) {
                            updatedThinking += parts[0];
                        }

                        if (parts[1]) {
                            updatedImprovements = updatedImprovements === getLoadingMessage() ? parts[1] : updatedImprovements + parts[1];
                        }
                    }
                    // 일반 토큰 처리
                    else {
                        if (isThinking) {
                            updatedThinking += token;
                        } else {
                            if (updatedImprovements === getLoadingMessage()) {
                                updatedImprovements = token;
                            } else {
                                updatedImprovements += token;
                            }
                        }
                    }

                    // 스트리밍 완료 시 번역 처리
                    if (data.is_end) {
                        updatedThinking = updatedThinking.replace(/<\/?think>/g, "");
                        updatedImprovements = updatedImprovements.replace(/<\/?think>/g, "");

                        if (updatedImprovements === getLoadingMessage()) {
                            updatedImprovements = "결과가 제공되지 않았습니다.";
                        }

                        // 비동기 번역 처리
                        (async () => {
                            try {
                                const translatedThinking = updatedThinking ? await translateText(updatedThinking) : "";
                                const translatedImprovements = updatedImprovements ? await translateText(updatedImprovements) : "";

                                setAiResult({
                                    thinking: translatedThinking,
                                    improvements: translatedImprovements
                                });
                            } catch (error) {
                                console.error('번역 처리 중 오류:', error);
                                setAiResult({
                                    thinking: updatedThinking,
                                    improvements: updatedImprovements
                                });
                            }
                        })();

                        return prev;
                    }

                    return {
                        thinking: updatedThinking,
                        improvements: updatedImprovements
                    };
                });

                if (data.is_end) {
                    setIsProcessing(false);
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

    // ==================== UI 텍스트 헬퍼 함수들 ====================
    const getLoadingMessage = () => {
        if (!problem) return "⏳ 요청 처리 중...";

        switch (problem.option) {
            case 0:
                return "⏳ AI 개선 요청 중...";
            case 1:
                return "⏳ 알고리즘 로직 분석 중...";
            case 3:
                return "⏳ 클린코드 리팩토링을 돕는 중..."
            case 4:
                return "⏳ 알고리즘 분석 중..."
            default:
                return "⏳ 요청 처리 중...";
        }
    };

    const getButtonText = () => {
        if (!problem) return "AI 요청";

        switch (problem.option) {
            case 0:
                return "AI 개선 요청";
            case 1:
                return "알고리즘 로직 분석";
            case 4:
                return "알고리즘 분석";
            default:
                return "AI 개선 요청";
        }
    };

    const getTabText = () => {
        if (!problem) return "AI 분석 결과";

        switch (problem.option) {
            case 0:
                return "AI 분석 결과";
            case 1:
                return "알고리즘 로직 분석";
            case 4:
                return "알고리즘 분석";
            default:
                return "AI 분석 결과";
        }
    };

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

    const isAlgorithmAnalysis = () => {
        return problem && problem.option === 1;
    };

    // ==================== AI 분석 요청 처리 ====================
    const handleAiRequest = () => {
        if (!code.trim()) {
            setAiResult({ thinking: "", improvements: "⚠️ 코드를 입력하세요." });
            return;
        }

        const question = `Question: ${problem.description}${problem.constraints ? '\n' + problem.constraints : ''}`;

        const requestData = {
            question: question,
            prompt: code,
            option: problem ? problem.option : 0
        };

        socketRef.current.emit("predict_streaming", requestData);
        setAiResult({ thinking: "", improvements: getLoadingMessage() });
        setActiveTab("ai");
    };

    // ==================== Pylint 결과 포맷팅 ====================
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

    // ==================== 코드 제출 처리 ====================
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
            setPylintResult(null);

            // 코드 제출 API 호출
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

            // Pylint 분석 실행
            const pylintRes = await fetch("http://localhost:8080/pylint/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code })
            });

            if (pylintRes.ok) {
                const pylintData = await pylintRes.json();
                const formattedPylintOutput = formatPylintOutput(pylintData.output);
                setPylintResult({
                    ...pylintData,
                    formattedOutput: formattedPylintOutput
                });
            } else {
                setPylintResult({ output: "❌ Pylint 분석 실패", score: 0 });
            }

            setActiveTab("grading");
        } catch (err) {
            setGradingResult(`❌ 제출 오류: ${err.message}`);
        }
    };

    // ==================== 코드 채점 처리 ====================
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
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok) throw new Error("채점 실행 실패");

            const resultData = await response.text();
            setGradingResult(`✅ 실행 결과: ${resultData}`);
            setActiveTab("grading");
        } catch (err) {
            setGradingResult(`❌ 채점 오류: ${err.message}`);
        }
    };

    // ==================== UI 상호작용 처리 ====================
    const toggleThinking = () => {
        setIsThinkingVisible(!isThinkingVisible);
    };

    // ==================== 렌더링 조건 검사 ====================
    if (loading) return <p>문제 정보를 불러오는 중...</p>;
    if (error) return <p>오류 발생: {error}</p>;

    // ==================== 컴포넌트 렌더링 ====================
    return (
        <div className="problem-detail-container">
            {/* 문제 정보 헤더 */}
            <div className="problem-header">
                <h2>{problem.title}</h2>
                <p>{problem.description}</p>
            </div>

            <div className="main-layout">
                {/* 코드 에디터 영역 */}
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

                    {/* 코드 실행 버튼들 */}
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

                    {/* 테스트 케이스 및 제약사항 표시 */}
                    {!isAlgorithmAnalysis() && problem.inputExamples && (
                        <div className="test-case">
                            <h3>예제 입력</h3>
                            <pre>{problem.inputExamples?.join("\n")}</pre>
                            <h3>예제 출력</h3>
                            <pre>{problem.outputExamples?.join("\n")}</pre>
                            <h3>제한 사항</h3>
                            <pre>{problem.constraints}</pre>
                        </div>
                    )}

                    {isAlgorithmAnalysis() && (
                        <div className="test-case">
                            <h3>제한 사항</h3>
                            <pre>{problem.constraints}</pre>
                        </div>
                    )}
                </div>

                {/* 결과 표시 영역 */}
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
                                    <div className="loading-message">
                                        {gradingResult || `채점 결과 표시됩니다.`}
                                    </div>

                                    {gradingResult && pylintResult && (
                                        <div className="pylint-section">
                                            <h4>🧪 Pylint 분석 결과</h4>
                                            <p><strong>점수:</strong> {pylintResult.score} / 10</p>
                                            <div
                                                className="pylint-output"
                                                dangerouslySetInnerHTML={{ __html: pylintResult.formattedOutput }}
                                            ></div>
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