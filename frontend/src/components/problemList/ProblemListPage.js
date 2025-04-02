import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProblemListPage.css';

export const ProblemListPage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [problems, setProblems] = useState([]); // ✅ 문제 목록을 API에서 불러오기 위해 useState 사용
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    // ✅ 검색 기능 적용
    const filteredProblems = problems.filter(problem =>
        problem.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <p>문제 목록을 불러오는 중...</p>;
    if (error) return <p>오류 발생: {error}</p>;

    return (
        <div id="webcrumbs" className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <h1 className="text-xl font-bold text-center mb-4">문제 목록</h1>

            {/* 검색 입력란 추가 */}
            <div className="search-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="search-button">검색</button>
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
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProblems.map(problem => (
                            <tr key={problem.id}
                                className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                                onClick={() => navigate(`/problems/${problem.id}`)}>  {/* ✅ 문제 클릭 시 이동 */}
                                <td className="py-3 px-4 border-b border-gray-200">{problem.id}</td>
                                <td className="py-3 px-4 border-b border-gray-200 text-blue-500 hover:text-blue-700 transition-colors duration-150">{problem.title}</td>
                                <td className="py-3 px-4 border-b border-gray-200">{problem.description}</td>
                                <td className="py-3 px-4 border-b border-gray-200">{problem.constraints}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ProblemListPage;
