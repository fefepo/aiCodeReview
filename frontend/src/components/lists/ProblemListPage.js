import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ProblemListPage.css';

const problems = [
    { id: 1000, title: 'A+B', info: '기본 연산 문제', difficulty: 1, solved: 328392, submitted: 1234574, rate: '38.59%' },
    { id: 1001, title: 'A-B', info: '기본 연산 문제', difficulty: 1, solved: 282350, submitted: 498200, rate: '69.12%' },
    { id: 1002, title: '터렛', info: '기하학 문제', difficulty: 2, solved: 40615, submitted: 232290, rate: '22.74%' },
    { id: 1003, title: '피보나치 함수', info: 'DP(동적 계획법)', difficulty: 3, solved: 61351, submitted: 242315, rate: '33.98%' },
    { id: 1004, title: '어린 왕자', info: '원과 직선 문제', difficulty: 2, solved: 17407, submitted: 45144, rate: '46.66%' },
    { id: 1005, title: 'ACM Craft', info: '위상 정렬', difficulty: 4, solved: 16927, submitted: 84274, rate: '29.91%' },
    { id: 1006, title: '숨겨져 초라기', info: '스페셜 저지 문제', difficulty: 5, solved: 2661, submitted: 22592, rate: '20.66%' },
    { id: 1007, title: '벡터 매칭', info: '스페셜 저지 문제', difficulty: 4, solved: 3794, submitted: 13916, rate: '37.94%' },
    { id: 1008, title: 'A/B', info: '기본 연산 문제', difficulty: 1, solved: 233594, submitted: 830903, rate: '34.54%' },
    { id: 1009, title: '분산처리', info: '수학적 패턴 문제', difficulty: 3, solved: 24492, submitted: 127743, rate: '24.41%' },
];

const ProblemList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 10; // 1~10 페이지

    const displayedProblems = currentPage === 1 ? problems : [];

    return (
        <div className="problem-list-container">
            <h2>문제 목록</h2>
            <table className="problem-table">
                <thead>
                    <tr>
                        <th>문제</th>
                        <th>문제 제목</th>
                        <th>유형</th>
                        <th>난이도</th>
                        <th>맞힌 사람</th>
                        <th>제출</th>
                        <th>정답 비율</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedProblems.length > 0 ? (
                        displayedProblems.map((problem) => (
                            <tr key={problem.id}>
                                <td>{problem.id}</td>
                                <td>
                                    <Link to={`/problem/${problem.id}`} className="problem-link">
                                        {problem.title}
                                    </Link>
                                </td>
                                <td>{problem.info}</td>
                                <td>{`난이도 ${problem.difficulty}`}</td>
                                <td>{problem.solved.toLocaleString()}</td>
                                <td>{problem.submitted.toLocaleString()}</td>
                                <td>{problem.rate}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                                문제가 없습니다.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="pagination">
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index + 1}
                        className={currentPage === index + 1 ? 'active' : ''}
                        onClick={() => setCurrentPage(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ProblemList;