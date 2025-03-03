import React from 'react';
import './ProblemDetailPage.css';

function ProblemDetailPage() {
    return (
        <div className="problem-detail-container">
            {/* 상단 문제 제목 및 설명 */}
            <div className="problem-header">
                <h2>문제 제목이 여기에 표시됩니다.</h2>
                <p>주어진 문제에 대한 간략한 설명이 여기에 들어갑니다.</p>
            </div>

            <div className="main-layout">
                {/* 사이드바 메뉴 */}
                <div className="sidebar">
                    <ul>
                        <li>문제 목록</li>
                        <li>체점 현황</li>
                        <li>랭킹</li>
                        <li>설정</li>
                    </ul>
                </div>

                {/* 코드 입력 및 실행 영역 */}
                <div className="editor-container">
                    <div className="code-editor">
                        <textarea placeholder="여기에 코드를 입력하세요..."></textarea>
                    </div>
                    <div className="code-actions">
                        <button className="btn-run">코드 실행</button>
                        <button className="btn-submit">코드 제출</button>
                        <button className="btn-reset">코드 초기화</button>
                    </div>
                    <div className="test-case">
                        <p>예제 입력과 출력이 여기에 표시됩니다.</p>
                    </div>
                </div>

                {/* 채팅 및 설명 영역 */}
                <div className="chat-section">
                    <div className="chat-box">ChatBot: 코드 실행과 관련된 설명이 표시됩니다.</div>
                    <div className="chat-input-container">
                        <input type="text" placeholder="질문을 입력하세요..." />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProblemDetailPage;
