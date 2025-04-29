import React, { useState, useEffect } from 'react';
import './MenuBar.css';
import { jwtDecode } from 'jwt-decode';

const MenuBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      const decodedToken = jwtDecode(token);
      setUsername(decodedToken.sub);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUsername('');
    alert('로그아웃 되었습니다.');
    window.location.href = '/';
  };

  const handleMenuClick = (url) => {
    if (url === '/achievement' && !isLoggedIn) {
      alert('로그인이 필요합니다.');
      window.location.href = '/login';
      return;
    }
    window.location.href = url;
  };

  return (
    <div className="menuBar-container">
      {/* 상단 정보 줄 */}
      <div className="menuBar-top">
        <div className="menuBar-left">
          <a href="/" className="menuBar-logo">Quest<span className="highlight">Code</span></a>
          <span className="menuBar-description">클린 코드 학습 플랫폼</span>
        </div>
        <div className="menuBar-right">
          {isLoggedIn ? (
            <>
              <a href="/profile" className="menuBar-greeting">안녕하세요, {username}님!</a>
              <button onClick={handleLogout} className="menuBar-logout">로그아웃</button>
            </>
          ) : (
            <>
              <a href="/login" className="menuBar-auth">로그인</a>
              <a href="/signup" className="menuBar-auth">회원가입</a>
            </>
          )}
        </div>
      </div>

      {/* 하단 내비게이션 줄 */}
      <div className="menuBar-bottom">
        <span onClick={() => handleMenuClick('/')} className="menuBar-nav">메인</span>
        <span onClick={() => handleMenuClick('/')} className="menuBar-nav2">가이드</span>
        <span onClick={() => handleMenuClick('/ranking')} className="menuBar-nav">순위</span>
        <span onClick={() => handleMenuClick('/achievement')} className="menuBar-nav">업적</span>
        <span onClick={() => handleMenuClick('/problems')} className="menuBar-nav">문제</span>
        <span onClick={() => handleMenuClick('/board')} className="menuBar-nav">게시판</span>
        <span onClick={() => handleMenuClick('/code-status')} className="menuBar-nav">채점상황</span>
      </div>
    </div>
  );
};

export default MenuBar;
