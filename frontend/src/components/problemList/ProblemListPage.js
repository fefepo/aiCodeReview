import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProblemListPage.css';

export const ProblemListPage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    const problems = [
        { id: 1001, title: '[기초-출력] 출력하기01(설명)', source: '기초100제', passed: 317697, submitted: 589454, successRate: 53 },
        { id: 1002, title: '[기초-출력] 출력하기02(설명)', source: '기초100제', passed: 262004, submitted: 396616, successRate: 66 },
        { id: 1003, title: '[기초-출력] 출력하기03(설명)', source: '기초100제', passed: 263877, submitted: 461418, successRate: 57 },
        { id: 1004, title: '[기초-출력] 출력하기04(설명)', source: '기초100제', passed: 263877, submitted: 461418, successRate: 37 },
        { id: 1005, title: '[기초-출력] 출력하기05(설명)', source: '기초100제', passed: 263877, submitted: 461418, successRate: 47 },
        { id: 1006, title: '[기초-출력] 출력하기06(설명)', source: '기초100제', passed: 263877, submitted: 461418, successRate: 57 },
        { id: 1007, title: '[기초-출력] 출력하기07(설명)', source: '기초100제', passed: 263877, submitted: 461418, successRate: 17 },
    ];

    // 필터링된 문제 목록
    const filteredProblems = problems.filter(problem =>
        problem.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                            <th className="py-3 px-4 text-left border-b border-gray-200">출처</th>
                            <th className="py-3 px-4 text-right border-b border-gray-200">통과</th>
                            <th className="py-3 px-4 text-right border-b border-gray-200">제출</th>
                            <th className="py-3 px-4 text-center border-b border-gray-200">성공률</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProblems.map(problem => (
                            <tr key={problem.id} className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer" onClick={() => navigate(`/problems/${problem.id}`)}>
                                <td className="py-3 px-4 border-b border-gray-200">{problem.id}</td>
                                <td className="py-3 px-4 border-b border-gray-200 text-blue-500 hover:text-blue-700 transition-colors duration-150">{problem.title}</td>
                                <td className="py-3 px-4 border-b border-gray-200">{problem.source}</td>
                                <td className="py-3 px-4 border-b border-gray-200 text-right text-blue-500">{problem.passed.toLocaleString()}</td>
                                <td className="py-3 px-4 border-b border-gray-200 text-right">{problem.submitted.toLocaleString()}</td>
                                <td className="py-3 px-4 border-b border-gray-200">
                                    <div className="flex items-center justify-center">
                                        <div className="w-32 bg-gray-200 rounded-full h-2.5">
                                            <div className="bg-teal-500 h-2.5 rounded-full" style={{ width: `${problem.successRate}%` }}></div>
                                        </div>
                                        <span className="ml-2 text-xs text-teal-600">{problem.successRate}%</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ProblemListPage;
