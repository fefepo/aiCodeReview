import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 🔹 추가
import '../user/ProfileProblems.css';

export const AdminApprovalPage = () => {
    const [pendingProblems, setPendingProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // 🔹 추가

    // ✅ 전체 문제 중 PENDING만 가져오기
    useEffect(() => {
        const fetchPendingProblems = async () => {
            try {
                const response = await fetch("http://localhost:8080/problems/admin");
                if (!response.ok) {
                    throw new Error("문제 목록을 불러오는 데 실패했습니다.");
                }
                const data = await response.json();
                const pending = data.filter(problem => problem.status === "PENDING");
                setPendingProblems(pending);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPendingProblems();
    }, []);

    // 🔄 승인 또는 거절 처리
    const handleDecision = async (id, action) => {
        try {
            const response = await fetch(`http://localhost:8080/problems/${id}/${action}`, {
                method: 'PUT'
            });
            if (!response.ok) {
                throw new Error(`${action} 실패`);
            }
            setPendingProblems(prev => prev.filter(problem => problem.id !== id));
        } catch (err) {
            alert(`${action === "approve" ? "승인" : "거절"}에 실패했습니다.`);
            console.error(err);
        }
    };

    if (loading) return <p>문제 목록을 불러오는 중...</p>;
    if (error) return <p>오류 발생: {error}</p>;

    return (
        <div className="profile-problems-container">
            <div className="profile-problems-box">
                <h1 className="profile-problems-title">승인 대기 문제 목록</h1>

                {pendingProblems.length === 0 ? (
                    <p className="profile-problems-empty">승인 대기 중인 문제가 없습니다.</p>
                ) : (
                    <table className="profile-problems-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>제목</th>
                                <th>작성자</th>
                                <th>승인</th>
                                <th>거절</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingProblems.map(problem => (
                                <tr key={problem.id}>
                                    <td>{problem.id}</td>
                                    <td
                                        className="profile-problems-title-cell"
                                        onClick={() => navigate(`/problems/${problem.id}`)} // 🔹 링크 추가
                                    >
                                        {problem.title}
                                    </td>
                                    <td>{problem.createdBy || "N/A"}</td>
                                    <td>
                                        <button
                                            className="profile-problems-edit-button"
                                            onClick={() => handleDecision(problem.id, "approve")}
                                        >
                                            승인
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className="profile-problems-edit-button"
                                            style={{ backgroundColor: "#e94e4e" }}
                                            onClick={() => handleDecision(problem.id, "reject")}
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

export default AdminApprovalPage;
