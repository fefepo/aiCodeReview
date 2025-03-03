import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProblemListPage.css';

function ProblemListPage() {
    const navigate = useNavigate();

    const problems = [
        { id: 1, title: '두 수의 합', difficulty: '쉬움' },
        { id: 2, title: '연속된 수의 합', difficulty: '보통' },
        { id: 3, title: '최대 공약수와 최소 공배수', difficulty: '어려움' }
    ];

    return (
        <div className="problem-container">
            <div className="problem-list">
                <h1 className="problem-title">문제 목록</h1>
                <table className="problem-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>제목</th>
                            <th>난이도</th>
                        </tr>
                    </thead>
                    <tbody>
                        {problems.map(problem => (
                            <tr key={problem.id} className="problem-item" onClick={() => navigate(`/problems/${problem.id}`)}>
                                <td>{problem.id}</td>
                                <td>{problem.title}</td>
                                <td className={`difficulty-${problem.difficulty}`}>{problem.difficulty}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ProblemListPage;
