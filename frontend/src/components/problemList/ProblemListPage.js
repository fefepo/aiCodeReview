import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProblemListPage.css';

export const ProblemListPage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [problems, setProblems] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [stats, setStats] = useState({});
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
        const fetchProblemsAndSubmissions = async () => {
            try {
                const [problemRes, submissionRes] = await Promise.all([
                    fetch("http://localhost:8080/problems"),
                    fetch("http://localhost:8080/submissions"),
                ]);

                if (!problemRes.ok || !submissionRes.ok) {
                    throw new Error("데이터를 불러오는 데 실패했습니다.");
                }

                const problemsData = await problemRes.json();
                const submissionsData = await submissionRes.json();

                setProblems(problemsData);
                setSubmissions(submissionsData);

                const problemStats = {};

                submissionsData.forEach(sub => {
                    const pid = sub.problemId;
                    if (!problemStats[pid]) {
                        problemStats[pid] = { total: 0, correct: 0 };
                    }
                    problemStats[pid].total += 1;
                    if (sub.status === '정확한 풀이' || sub.status === 'Correct') {
                        problemStats[pid].correct += 1;
                    }
                });

                setStats(problemStats);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProblemsAndSubmissions();
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
                            <th>출제자</th>
                            <th>제출 수</th>
                            <th>맞힌 수</th>
                            <th>정답률</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProblems.map((problem, index) => {
                            const stat = stats[problem.id] || { total: 0, correct: 0 };
                            const rate = stat.total === 0 ? '0%' :
                                ((stat.correct / stat.total) * 100).toFixed(1) + '%';

                            return (
                                <tr
                                    key={problem.id || index}
                                    onClick={() => navigate(`/problems/${problem.id}`)}
                                >
                                    <td>{index + 1}</td>
                                    <td className="problemList-title-link">{problem.title}</td>
                                    <td>{problem.createdBy || "익명"}</td>
                                    <td>{stat.total}</td>
                                    <td>{stat.correct}</td>
                                    <td>{rate}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProblemListPage;
