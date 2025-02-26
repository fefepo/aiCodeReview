import React, { useState } from 'react';
import './CreateProblemPage.css';

function CreateProblemPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCompany, setSelectedCompany] = useState('');
    const [styleSuggestions, setStyleSuggestions] = useState([]);

    return (
        <div className="cp-container">
            <h1 className="cp-title">문제 생성</h1>
            <div className="cp-form">
                <label className="cp-label">제목</label>
                <input type="text" className="cp-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="문제 제목을 입력하세요" />

                <label className="cp-label">설명</label>
                <textarea className="cp-textarea" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="문제 설명을 입력하세요" />

                <label className="cp-label">기업 코드 스타일 선택</label>
                <div className="cp-radio-group">
                    <input type="radio" name="company" value="CompanyA" id="companyA" onChange={(e) => setSelectedCompany(e.target.value)} />
                    <label htmlFor="companyA" className="cp-radio-label">Company A</label>
                    <input type="radio" name="company" value="CompanyB" id="companyB" onChange={(e) => setSelectedCompany(e.target.value)} />
                    <label htmlFor="companyB" className="cp-radio-label">Company B</label>
                </div>

                <label className="cp-label">추가 코드 스타일 제안</label>
                <div className="cp-checkbox-group">
                    <input type="checkbox" value="Style1" id="style1" onChange={(e) => setStyleSuggestions([...styleSuggestions, e.target.value])} />
                    <label htmlFor="style1" className="cp-checkbox-label">스타일 1</label>
                    <input type="checkbox" value="Style2" id="style2" onChange={(e) => setStyleSuggestions([...styleSuggestions, e.target.value])} />
                    <label htmlFor="style2" className="cp-checkbox-label">스타일 2</label>
                </div>

                <button className="cp-submit" disabled>문제 생성</button>
            </div>
        </div>
    );
}

export default CreateProblemPage;
