import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProblemListPage.css';

export const ProblemListPage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

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

    const filteredProblems = problems.filter(problem =>
        problem.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <p>문제 목록을 불러오는 중...</p>;
    if (error) return <p>오류 발생: {error}</p>;

    return (
        <div id="problemList-container" className="problemList-container">
            <h1 className="problemList-title">문제 목록</h1>

            <div className="problemList-search-container">
                <input
                    type="text"
                    className="problemList-search-input"
                    placeholder="검색어를 입력하세요..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="problemList-search-button">검색</button>

                {isLoggedIn && (
                    <button
                        className="problemList-create-button"
                        onClick={() => navigate("/create-problem")}
                    >
                        + 문제 생성
                    </button>
                )}
            </div>

            <div className="problemList-table-wrapper">
                <table className="problemList-table">
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>문제명</th>
                            <th>설명</th>
                            <th>제한사항</th>
                            <th>출제자</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProblems.map((problem) => (
                            <tr
                                key={problem.id}
                                onClick={() => navigate(`/problems/${problem.id}`)}
                            >
                                <td>{problem.id}</td>
                                <td className="problemList-title-link">{problem.title}</td>
                                <td>
                                    {problem.description.length > 30
                                        ? `${problem.description.substring(0, 30)}...`
                                        : problem.description}
                                </td>
                                <td>{problem.constraints}</td>
                                <td>{problem.createdBy || "익명"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ProblemListPage;
