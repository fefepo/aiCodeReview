import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateRulePage.css';

const CreateRulePage = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/rules", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ title, description })
            });

            if (!response.ok) {
                throw new Error("규칙 생성 실패");
            }

            const result = await response.json();
            setMessage("규칙이 성공적으로 생성되었습니다!");
            setTitle('');
            setDescription('');
        } catch (error) {
            setMessage("오류: " + error.message);
        }
    };

    return (
        <div className="rules-container">
            <h1 className="rules-title">규칙 생성</h1>

            <form className="rules-form" onSubmit={handleSubmit}>
                <div className="rules-label2">✅ 규칙 카테고리를 직접 만들어보세요!</div>
                <div className="rules-label2">✅ 생성된 규칙은 관리자가 검토 후, 승인 및 거절이 될 예정입니다.</div>
                <label className="rules-label">제목</label>
                <input
                    className="rules-input"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="규칙 제목을 입력하세요"
                    required
                />

                <label className="rules-label">설명</label>
                <textarea
                    className="rules-textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="규칙에 대한 설명을 입력하세요"
                    required
                />

                <button type="submit" className="rules-submit-button">
                    규칙 생성
                </button>

                {message && <p className="rules-message">{message}</p>}
            </form>
        </div>
    );
};

export default CreateRulePage;
