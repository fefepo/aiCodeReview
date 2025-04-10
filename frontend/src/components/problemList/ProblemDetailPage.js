import React, { useState, useEffect } from "react";
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
    const [aiResult, setAiResult] = useState(""); // ✅ AI 분석 결과
    const [userId, setUserId] = useState(null); // ✅ JWT에서 가져온 사용자 ID

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
        const socket = io("http://localhost:8888"); // 🔁 Python 서버 주소에 맞게 수정
        socket.on("connect", () => {
            console.log("🟢 WebSocket connected");
        });

        socket.on("ai_response", (data) => {
            setAiResult(data.message); // ✅ AI 결과 저장
        });

        socket.on("disconnect", () => {
            console.log("🔴 WebSocket disconnected");
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    // ✅ 코드 제출 (API 요청)
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
            const response = await fetch("http://localhost:8080/submissions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}` // ✅ JWT 포함
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
            setSubmissionId(data.id); // 제출된 ID 저장
            setGradingResult(`✅ 코드 제출 완료! 채점 ID: ${data.id}`);
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
        } catch (err) {
            setGradingResult(`❌ 채점 오류: ${err.message}`);
        }
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
                            height="400px"
                            className="scp-code-input"
                        />
                    </div>
                    <div className="code-actions">
                        <button className="btn-submit" onClick={handleSubmit}>코드 제출</button>
                        <button className="btn-run" onClick={handleExecute}>코드 채점</button>
                        <button className="btn-reset" onClick={() => setCode("")}>코드 초기화</button>
                    </div>
                    <div className="test-case">
                        <h3>예제 입력</h3>
                        <pre>{problem.inputExamples.join("\n")}</pre>
                        <h3>예제 출력</h3>
                        <pre>{problem.outputExamples.join("\n")}</pre>
                    </div>
                </div>

                {/* 채점 및 분석 영역 */}
                <div className="chat-section">
                    <div className="chat-box">{gradingResult || "코드 채점 및 분석 결과가 표시됩니다."}</div>
                    <div className="chat-box">{aiResult || "AI 결과가 표시됩니다."}</div>
                </div>
            </div>
        </div>
    );
}

export default ProblemDetailPage;
