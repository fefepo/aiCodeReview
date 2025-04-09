import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StatusPage.css';

const resultClass = {
    '정확한 풀이': 'statusPage-result-accepted',
    '잘못된 풀이': 'statusPage-result-wrong',
    '컴파일 에러': 'statusPage-result-error',
    '채점 대기 중': 'statusPage-result-pending',
    'Correct': 'statusPage-result-accepted',
    'Wrong Answer': 'statusPage-result-wrong',
    'Error': 'statusPage-result-error',
    'Pending': 'statusPage-result-pending'
};

const formatResult = (status) => {
    if (status === 'Correct') return '정확한 풀이';
    if (status === 'Wrong Answer') return '잘못된 풀이';
    if (status === 'Error') return '컴파일 에러';
    if (status === 'Pending') return '채점 대기 중';
    return status;
};

const StatusPage = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;
    const navigate = useNavigate(); // ✅ navigate 누락되어 있던 부분

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await fetch('http://localhost:8080/submissions');
                if (!response.ok) {
                    throw new Error('제출 기록을 불러오는 데 실패했습니다.');
                }
                const data = await response.json();
                // 최신 제출이 먼저 오도록 정렬
                setSubmissions(
                    data.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
                );
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, []);


    const totalPages = Math.ceil(submissions.length / itemsPerPage);
    const currentData = submissions.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    if (loading) return <p>제출 기록을 불러오는 중...</p>;
    if (error) return <p>오류 발생: {error}</p>;

    return (
        <div className="statusPage-wrapper">
            <h1 className="statusPage-title">코드 채점 기록</h1>

            <table className="statusPage-table">
                <thead>
                    <tr>
                        <th>제출 번호</th>
                        <th>사용자</th>
                        <th>문제 번호</th>
                        <th>결과</th>
                        <th>사용 언어</th>
                        <th>코드 길이</th>
                        <th>제출 시간</th>
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((submission) => (
                        <tr key={submission.id}>
                            <td>{submission.id}</td>
                            <td className="statusPage-username">{submission.userId}</td>

                            <td>
                                <span
                                    className="statusPage-problem-link"
                                    onClick={() => navigate(`/problems/${submission.problemId}`)}
                                >
                                    {submission.problemId}
                                </span>
                            </td>

                            <td>
                                <span
                                    className={`statusPage-result-tag ${resultClass[submission.status] || ''
                                        }`}
                                >
                                    {formatResult(submission.status)}
                                </span>
                            </td>

                            <td>{submission.language}</td>
                            <td>{submission.code.length} B</td>
                            <td>{new Date(submission.submittedAt).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="statusPage-pagination">
                <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
                    {'«'}
                </button>

                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => setPage(i + 1)}
                        className={page === i + 1 ? 'statusPage-active-page' : ''}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                >
                    {'»'}
                </button>
            </div>
        </div>
    );
};

export default StatusPage;
