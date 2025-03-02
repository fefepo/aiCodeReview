import React, { useState } from 'react';
import './MakeProblem.css';

const MakeProblem = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [inputExample, setInputExample] = useState('');
    const [outputExample, setOutputExample] = useState('');
    const [category, setCategory] = useState(''); // 문제 유형
    const [language, setLanguage] = useState(''); // 언어 선택
    const [difficulty, setDifficulty] = useState(''); // 난이도 선택

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('문제 제출:', { title, description, inputExample, outputExample, category, language, difficulty });
        alert('문제가 생성되었습니다.');
    };

    return (
        <div className="make-problem-container">
            <h2>문제 생성</h2>
            <form onSubmit={handleSubmit}>
                <label>문제 제목:</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

                <label>문제 설명:</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

                <label>문제 유형:</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                    <option value="">문제 유형 선택</option>
                    <option value="기본연산문제">기본연산문제</option>
                    <option value="기하학문제">기하학문제</option>
                    <option value="DP">DP</option>
                    <option value="수학적 패턴문제">수학적 패턴문제</option>
                    <option value="그래프">그래프</option>
                </select>

                <label>언어:</label>
                <select value={language} onChange={(e) => setLanguage(e.target.value)} required>
                    <option value="">언어 선택</option>
                    <option value="Python">Python</option>
                    <option value="Java">Java</option>
                    <option value="C++">C++</option>
                    <option value="JavaScript">JavaScript</option>
                </select>

                <label>난이도:</label>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} required>
                    <option value="">난이도 선택</option>
                    <option value="1">난이도 1</option>
                    <option value="2">난이도 2</option>
                    <option value="3">난이도 3</option>
                    <option value="4">난이도 4</option>
                    <option value="5">난이도 5</option>
                </select>

                <label>입력 예시:</label>
                <textarea value={inputExample} onChange={(e) => setInputExample(e.target.value)} required />

                <label>출력 예시:</label>
                <textarea value={outputExample} onChange={(e) => setOutputExample(e.target.value)} required />

                <button type="submit">문제 생성</button>
            </form>
        </div>
    );
};

export default MakeProblem;