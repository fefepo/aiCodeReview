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
        <div id="webcrumbs" className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <h1 className="text-xl font-bold text-center mb-4">문제 목록</h1>

            <div className="search-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="search-button">검색</button>

                {isLoggedIn && (
                    <button className="search-button2" onClick={() => navigate("/create-problem")}>
                        문제 생성
                    </button>
                )}
            </div>

            {/* 문제 목록 테이블 */}
            <div className="search-container">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-blue-100">
                            <th className="py-3 px-4 text-left border-b border-gray-200">번호</th>
                            <th className="py-3 px-4 text-left border-b border-gray-200">문제명</th>
                            <th className="py-3 px-4 text-left border-b border-gray-200">설명</th>
                            <th className="py-3 px-4 text-left border-b border-gray-200">제한사항</th>
                            <th className="py-3 px-4 text-left border-b border-gray-200">출제자</th>  {/* ✅ 출제자 추가 */}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProblems.map(problem => (
                            <tr key={problem.id}
                                className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                                onClick={() => navigate(`/problems/${problem.id}`)}>
                                <td className="py-3 px-4 border-b border-gray-200">{problem.id}</td>
                                <td className="py-3 px-4 border-b border-gray-200 text-blue-500 hover:text-blue-700 transition-colors duration-150">
                                    {problem.title}
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200">
                                    {problem.description.length > 30
                                        ? `${problem.description.substring(0, 30)}...`
                                        : problem.description}
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200">{problem.constraints}</td>
                                <td className="py-3 px-4 border-b border-gray-200">{problem.createdBy || "익명"}</td>  {/* ✅ 출제자 표시 */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ProblemListPage;
