import React, { useState, useEffect } from 'react';
import './MenuBar.css';
import { FaChartLine, FaTrophy, FaStar, FaSignOutAlt, FaListUl, FaPlusCircle } from 'react-icons/fa';
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
    if ((url === '/achievement' || url === '/submission' || url === '/problems' || url === '/make-problem') && !isLoggedIn) {
      alert('로그인이 필요합니다.');
      window.location.href = '/login';
      return;
    }

    window.location.href = url;
  };

  return (
    <div className="menuBar-bar">
      <div className="menuBar-logo">
        <a href="/" className="menuBar-logo-link">
          CODE<span className="menuBar-logo-highlight">REVIEW</span>
        </a>
        <span className="menuBar-logo-subtext">코드 채점 사이트</span>
      </div>

      <div className="menuBar-items">
        <span onClick={() => handleMenuClick('/ranking')} className="menuBar-item">
          <FaChartLine className="menuBar-icon" />
          순위
        </span>

        <span onClick={() => handleMenuClick('/achievement')} className="menuBar-item">
          <FaTrophy className="menuBar-icon" />
          업적
        </span>

        <span onClick={() => handleMenuClick('/submission')} className="menuBar-item">
          <FaStar className="menuBar-icon" />
          코드 제출
        </span>

        <span onClick={() => handleMenuClick('/problems')} className="menuBar-item">
          <FaListUl className="menuBar-icon" />
          문제 목록
        </span>


      </div>

      <div className="menuBar-auth">
        {isLoggedIn ? (
          <>
            <a href="/profile-edit" className="menuBar-item">
              안녕하세요, {username}님!
            </a>
            <button onClick={handleLogout} className="menuBar-item menuBar-logout-button">
              <FaSignOutAlt className="menuBar-icon" />
              로그아웃
            </button>
          </>
        ) : (
          <>
            <a href="/login" className="menuBar-item-auth">
              로그인
            </a>
            <a href="/signup" className="menuBar-item-auth">
              회원가입
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default MenuBar;
