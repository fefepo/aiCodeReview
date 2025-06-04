import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../user/ProfileProblems.css"; // 기존 CSS 재사용

export const AdminRuleApprovalPage = () => {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // 규칙 불러오기
    useEffect(() => {
        const fetchRules = async () => {
            try {
                const response = await fetch("http://localhost:8080/rules");
                if (!response.ok) {
                    throw new Error("규칙 목록을 불러오는 데 실패했습니다.");
                }
                const data = await response.json();
                const pending = data.filter(rule => rule.status === "PENDING");
                setRules(pending);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRules();
    }, []);

    // 승인/거절 핸들러
    const handleDecision = async (id, action) => {
        try {
            const response = await fetch(`http://localhost:8080/rules/${id}/${action}`, {
                method: "PUT"
            });

            if (!response.ok) {
                throw new Error(`${action} 실패`);
            }

            const updatedRule = await response.json();
            setRules(prev => prev.map(rule => rule.id === id ? updatedRule : rule));
        } catch (err) {
            alert(`${action === "approve" ? "승인" : "거절"}에 실패했습니다.`);
            console.error(err);
        }
    };

    if (loading) return <p>규칙 목록을 불러오는 중...</p>;
    if (error) return <p>오류 발생: {error}</p>;

    return (
        <div className="profile-problems-container">
            <div className="profile-problems-box">
                <h1 className="profile-problems-title">규칙 관리</h1>

                {rules.length === 0 ? (
                    <p className="profile-problems-empty">규칙이 없습니다.</p>
                ) : (
                    <table className="profile-problems-table">
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>제목</th>
                                <th>설명</th>
                                <th>상태</th>
                                <th>승인</th>
                                <th>거절</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rules.map((rule, index) => (
                                <tr key={rule.id}>
                                    <td>{rule.ruleNumber || `R${index + 1}`}</td>
                                    <td>{rule.title}</td>
                                    <td>{rule.description}</td>
                                    <td>{rule.status}</td>
                                    <td>
                                        <button
                                            className="profile-problems-edit-button"
                                            onClick={() => handleDecision(rule.id, "approve")}
                                            disabled={rule.status === "APPROVED"}
                                        >
                                            승인
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className="profile-problems-edit-button"
                                            style={{ backgroundColor: "#e94e4e" }}
                                            onClick={() => handleDecision(rule.id, "reject")}
                                            disabled={rule.status === "REJECTED"}
                                        >
                                            거절
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminRuleApprovalPage;
