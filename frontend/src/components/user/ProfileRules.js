import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileProblems.css';

const ProfileRules = () => {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRules = async () => {
            try {
                const response = await fetch('http://localhost:8080/rules');
                if (!response.ok) {
                    throw new Error('규칙 목록을 불러오는 데 실패했습니다.');
                }
                const data = await response.json();
                setRules(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRules();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('정말로 이 규칙을 삭제하시겠습니까?')) return;

        try {
            const response = await fetch(`http://localhost:8080/rules/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.status === 204) {
                setRules(prev => prev.filter(rule => rule.id !== id));
            } else {
                throw new Error('삭제에 실패했습니다.');
            }
        } catch (err) {
            alert(`규칙 삭제 중 오류 발생: ${err.message}`);
        }
    };

    if (loading) return <p>규칙 목록을 불러오는 중...</p>;
    if (error) return <p>오류 발생: {error}</p>;

    return (
        <div className="profile-problems-container">
            <div className="profile-problems-box">
                <h1 className="profile-problems-title">생성한 규칙 목록</h1>

                {rules.length === 0 ? (
                    <p className="profile-problems-empty">아직 만든 규칙이 없습니다.</p>
                ) : (
                    <table className="profile-problems-table">
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>제목</th>
                                <th>설명</th>
                                <th>상태</th>
                                <th>수정</th>
                                <th>삭제</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rules.map((rule, index) => (
                                <tr key={rule.id}>
                                    <td>{index + 1}</td>
                                    <td>{rule.title}</td>
                                    <td>
                                        {rule.description.length > 30
                                            ? `${rule.description.substring(0, 30)}...`
                                            : rule.description}
                                    </td>
                                    <td>{rule.status}</td>
                                    <td>
                                        <button
                                            className="profile-problems-edit-button"
                                            onClick={() => navigate(`/edit-rule/${rule.id}`)}
                                        >
                                            수정
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className="profile-problems-delete-button"
                                            onClick={() => handleDelete(rule.id)}
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

export default ProfileRules;
