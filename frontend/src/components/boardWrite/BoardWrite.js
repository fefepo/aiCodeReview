import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BoardWrite.css';

const BoardWrite = () => {
    const [form, setForm] = useState({
        title: '',
        category: '질문',
        problemId: '',
        content: '',
        language: 'C++17'
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('작성된 데이터:', form);

        // TODO: 여기에 서버 전송 코드 추가 예정
        // 예: await axios.post('/api/board', form);

        // 작성 완료 후 게시판으로 이동
        navigate('/board');
    };

    const handleCancel = () => {
        navigate('/board');
    };

    return (
        <div className="write-container">
            <h2>게시글 작성</h2>
            <form className="write-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>제목</label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>카테고리</label>
                    <select name="category" value={form.category} onChange={handleChange}>
                        <option value="질문">질문</option>
                        <option value="자유">자유</option>
                        <option value="오타,오류">오타,오류</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>문제 번호</label>
                    <input
                        type="text"
                        name="problemId"
                        value={form.problemId}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>내용</label>
                    <textarea
                        name="content"
                        rows="10"
                        value={form.content}
                        onChange={handleChange}
                        placeholder="내용을 입력하세요..."
                        required
                    ></textarea>
                </div>

                <div className="form-group">
                    <label>언어</label>
                    <select name="language" value={form.language} onChange={handleChange}>
                        <option value="C++17">C</option>
                        <option value="Python3">Python</option>
                        <option value="Java">Java</option>
                    </select>
                </div>

                <div className="button-group">
                    <button type="submit" className="submit-btn">작성 완료</button>
                    <button type="button" className="cancel-btn" onClick={handleCancel}>취소</button>
                </div>
            </form>
        </div>
    );
};

export default BoardWrite;
