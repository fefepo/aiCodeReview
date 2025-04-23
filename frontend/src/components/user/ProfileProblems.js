import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './ProfileProblems.css';

export const ProfileProblems = () => {
    const navigate = useNavigate();
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

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

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const response = await fetch("http://localhost:8080/problems/admin");
                if (!response.ok) {
                    throw new Error("문제 목록을 불러오는 데 실패했습니다.");
                }
                const data = await response.json();
                setProblems(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProblems();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("정말로 이 문제를 삭제하시겠습니까?")) return;

        try {
            const response = await fetch(`http://localhost:8080/problems/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error("삭제에 실패했습니다.");
            }

            // 삭제 성공 시 상태에서 제거
            setProblems(prev => prev.filter(problem => problem.id !== id));
        } catch (err) {
            alert(`문제 삭제 중 오류 발생: ${err.message}`);
        }
    };

    const userProblems = problems.filter(problem => problem.createdBy === userId);

    if (loading) return <p>문제 목록을 불러오는 중...</p>;
    if (error) return <p>오류 발생: {error}</p>;

    return (
        <div className="profile-problems-container">
            <div className="profile-problems-box">
                <h1 className="profile-problems-title">내가 만든 문제</h1>

                {userProblems.length === 0 ? (
                    <p className="profile-problems-empty">아직 만든 문제가 없습니다.</p>
                ) : (
                    <table className="profile-problems-table">
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>문제명</th>
                                <th>설명</th>
                                <th>제한사항</th>
                                <th>수정</th>
                                <th>삭제</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userProblems.map(problem => (
                                <tr key={problem.id}>
                                    <td>{problem.id}</td>
                                    <td
                                        className="profile-problems-title-cell"
                                        onClick={() => navigate(`/problems/${problem.id}`)}
                                    >
                                        {problem.title}
                                    </td>
                                    <td>
                                        {problem.description.length > 30
                                            ? `${problem.description.substring(0, 30)}...`
                                            : problem.description}
                                    </td>
                                    <td>{problem.constraints}</td>
                                    <td>
                                        <button
                                            className="profile-problems-edit-button"
                                            onClick={() => navigate(`/edit-problem/${problem.id}`)}
                                        >
                                            수정
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className="profile-problems-delete-button"
                                            onClick={() => handleDelete(problem.id)}
                                        >
                                            삭제
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

export default ProfileProblems;
