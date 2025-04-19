// Footer.js
import React from "react";
import "./Footer.css";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-menuBar-logo">
                    Quest<span className="footer-menuBar-logo-highlight">Code</span>
                    <span className="footer-menuBar-logo-subtext">클린 코드 학습 플랫폼</span>
                </div>
                <div className="footer-info">
                    <p>팀장: 이현우</p>
                    <p>팀원: 박승아, 박기량, 윤용준</p>
                    <p>퀘스트코드 | AI기반 코드리뷰 및 클린코드 학습 플랫폼 | Email: dlgusdn0129@naver.com</p>
                    <p>&copy; 퀘스트코드 All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
