import React, { useState, useEffect } from 'react';
import './BoardAnswer.css';

const BoardAnswer = ({ boardId }) => {
    const [answers, setAnswers] = useState([]);
    const [newAnswer, setNewAnswer] = useState('');
    const [username, setUsername] = useState('');

    // JWT 디코딩 함수
    const getUsernameFromToken = () => {
        const token = localStorage.getItem('token');
        if (!token) return '';

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.sub || ''; // username은 subject(sub)에 들어있음
        } catch (err) {
            console.error('토큰 디코딩 실패:', err);
            return '';
        }
    };

    useEffect(() => {
        // 로그인한 사용자 이름 설정
        const user = getUsernameFromToken();
        setUsername(user);

        // 답변 목록 불러오기
        fetch(`http://localhost:8080/api/board/${boardId}/answers`)
            .then(res => res.json())
            .then(data => setAnswers(data))
            .catch(err => console.error('답변 불러오기 실패:', err));
    }, [boardId]);

    const handleSubmit = async () => {
        const response = await fetch(`http://localhost:8080/api/board/${boardId}/answers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: newAnswer, author: username })
        });

        if (response.ok) {
            setNewAnswer('');
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
                <p><strong>작성자:</strong> {username}</p>
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
