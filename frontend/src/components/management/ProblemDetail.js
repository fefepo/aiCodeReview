import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProblemDetail.css'; // 필요하면 스타일 추가

const ProblemDetail = () => {
    const { id } = useParams();
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const response = await fetch(`http://localhost:8080/problems/${id}`);
                if (!response.ok) {
                    throw new Error("문제 정보를 불러오는 데 실패했습니다.");
                }
                const data = await response.json();
                setProblem(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProblem();
    }, [id]);

    if (loading) return <p>문제 정보를 불러오는 중...</p>;
    if (error) return <p>오류 발생: {error}</p>;
    if (!problem) return <p>문제를 찾을 수 없습니다.</p>;

    return (
        <div className="problem-detail-container">
            <h1 className="problem-detail-title">{problem.title}</h1>
            <p><strong>설명:</strong> {problem.description}</p>
            <p><strong>입력 형식:</strong> {problem.inputFormat}</p>
            <p><strong>출력 형식:</strong> {problem.outputFormat}</p>
            <p><strong>제한사항:</strong> {problem.constraints}</p>
            <p><strong>예제 입력:</strong> <pre>{problem.sampleInput}</pre></p>
            <p><strong>예제 출력:</strong> <pre>{problem.sampleOutput}</pre></p>
            <p><strong>작성자:</strong> {problem.createdBy || "N/A"}</p>
            <p><strong>상태:</strong> {problem.status}</p>
        </div>
    );
};

export default ProblemDetail;
