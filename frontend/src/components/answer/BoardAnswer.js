import React, { useState, useEffect } from 'react';
import './BoardAnswer.css'; // 선택적: 스타일 분리할 경우

const BoardAnswer = ({ boardId }) => {
    const [answers, setAnswers] = useState([]);
    const [newAnswer, setNewAnswer] = useState('');
    const [author, setAuthor] = useState('');

    // 게시글에 대한 답변 목록 불러오기
    useEffect(() => {
        fetch(`http://localhost:8080/api/board/${boardId}/answers`)
            .then(res => res.json())
            .then(data => setAnswers(data))
            .catch(err => console.error('답변 불러오기 실패:', err));
    }, [boardId]);

    // 답변 저장
    const handleSubmit = async () => {
        const response = await fetch(`http://localhost:8080/api/board/${boardId}/answers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: newAnswer, author })
        });

        if (response.ok) {
            setNewAnswer('');
            setAuthor('');
            const updated = await fetch(`http://localhost:8080/api/board/${boardId}/answers`).then(res => res.json());
            setAnswers(updated);
        } else {
            alert('답변 저장 실패');
        }
    };

    return (
        <div className="answer-section">
            <h4>💬 답변</h4>
            {answers.map((answer, idx) => (
                <div key={idx} className="answer-box">
                    <p><strong>{answer.author}</strong> | {answer.createdAt?.slice(0, 10)}</p>
                    <p>{answer.content}</p>
                </div>
            ))}
            <div className="answer-form">
                <input
                    type="text"
                    placeholder="작성자"
                    value={author}
                    onChange={e => setAuthor(e.target.value)}
                />
                <textarea
                    placeholder="답변 내용을 입력하세요"
                    value={newAnswer}
                    onChange={e => setNewAnswer(e.target.value)}
                />
                <button onClick={handleSubmit}>답변 작성</button>
            </div>
        </div>
    );
};

export default BoardAnswer;
