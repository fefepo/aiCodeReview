import React, { useState, useEffect } from 'react';
import './BoardAnswer.css';

const BoardAnswer = ({ boardId }) => {
    const [answers, setAnswers] = useState([]);       // 답변 목록 상태
    const [newAnswer, setNewAnswer] = useState('');   // 새 답변 입력 상태
    const [username, setUsername] = useState('');     // 현재 로그인한 사용자 이름

    //  JWT 토큰에서 사용자 이름 추출 함수
    const getUsernameFromToken = () => {
        const token = localStorage.getItem('token');
        if (!token) return '';

        try {
            const payload = JSON.parse(atob(token.split('.')[1])); // base64 디코딩
            return payload.sub || ''; // username은 JWT의 sub 필드
        } catch (err) {
            console.error('토큰 디코딩 실패:', err);
            return '';
        }
    };

    //  컴포넌트 마운트 시 사용자 정보 및 기존 답변 불러오기
    useEffect(() => {
        const user = getUsernameFromToken();
        setUsername(user);

        // 답변 목록 GET
        fetch(`http://localhost:8080/api/board/${boardId}/answers`)
            .then(res => res.json())
            .then(data => setAnswers(data))
            .catch(err => console.error('답변 불러오기 실패:', err));
    }, [boardId]);

    //  답변 제출 핸들러 (POST)
    const handleSubmit = async () => {
        const response = await fetch(`http://localhost:8080/api/board/${boardId}/answers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: newAnswer, author: username })
        });

        if (response.ok) {
            setNewAnswer(''); // 입력 필드 초기화

            // 답변 리스트 최신화 (GET)
            const updated = await fetch(`http://localhost:8080/api/board/${boardId}/answers`)
                .then(res => res.json());
            setAnswers(updated);
        } else {
            alert('답변 저장 실패');
        }
    };

    return (
        <div className="answer-section">
            <h4>💬 답변</h4>

            {/* 답변 목록 렌더링 */}
            {answers.map((answer, idx) => (
                <div key={idx} className="answer-box">
                    <p><strong>{answer.author}</strong> | {answer.createdAt?.slice(0, 10)}</p>
                    <p>{answer.content}</p>
                </div>
            ))}

            {/* 답변 입력 폼 */}
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
