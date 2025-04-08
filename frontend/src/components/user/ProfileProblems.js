import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // 🔹 JWT 해석을 위해 추가
import './ProfileProblems.css';

export const ProfileProblems = () => {
    const navigate = useNavigate();
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

    // 🔹 로그인한 유저의 ID 가져오기
    useEffect(() => {
        const token = localStorage.getItem("token"); // 토큰 가져오기
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserId(decoded.sub); // JWT에서 사용자 ID 추출 (예: "sub" 필드 사용)
            } catch (error) {
                console.error("토큰 디코딩 실패:", error);
                setUserId('');
            }
        }
    }, []);

    // ✅ API 호출하여 문제 목록 불러오기
    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const response = await fetch("http://localhost:8080/problems");
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

    // ✅ 로그인한 사용자가 만든 문제만 필터링
    const userProblems = problems.filter(problem => problem.createdBy === userId);

    if (loading) return <p>문제 목록을 불러오는 중...</p>;
    if (error) return <p>오류 발생: {error}</p>;

    return (
        <div className="profile-problems-container">
            <h1 className="title">내가 만든 문제</h1>

            {userProblems.length === 0 ? (
                <p>아직 만든 문제가 없습니다.</p>
            ) : (
                <table className="problems-table">
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>문제명</th>
                            <th>설명</th>
                            <th>제한사항</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userProblems.map(problem => (
                            <tr key={problem.id} onClick={() => navigate(`/problems/${problem.id}`)}>
                                <td>{problem.id}</td>
                                <td className="problem-title">{problem.title}</td>
                                <td>
                                    {problem.description.length > 30
                                        ? `${problem.description.substring(0, 30)}...`
                                        : problem.description}
                                </td>
                                <td>{problem.constraints}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ProfileProblems;
