import React, { useState, useEffect } from 'react';
import './MenuBar.css';
import { FaChartLine, FaTrophy, FaStar, FaSignOutAlt, FaChalkboardTeacher, FaAlignLeft } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';

const MenuBar = () => {
  // 로그인 상태 및 사용자 이름 관리
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  // 컴포넌트 마운트 시 실행되는 useEffect
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      setIsLoggedIn(true);
      const decodedToken = jwtDecode(token);
      setUsername(decodedToken.sub); // 토큰에서 사용자 이름 추출
    }
  }, []);

  // 로그아웃 처리 함수
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUsername('');
    alert('로그아웃 되었습니다.');
    window.location.href = '/';
  };

  // 메뉴 클릭 처리 함수
  const handleMenuClick = (url) => {
    // 업적 페이지와 코드 제출 페이지는 로그인 필요
    if ((url === '/achievement') && !isLoggedIn) {
      alert('로그인이 필요합니다.');
      window.location.href = '/login'; // 로그인 페이지로 리디렉션
      return;
    }

    // 랭킹 페이지는 로그인 여부에 관계없이 이동 가능
    if ((url === '/ranking' || url === '/problems' || url === '/board' || url === 'code-status') || isLoggedIn) {
      window.location.href = url;
    }
  };

  return (
    <div className="menuBar-bar">
      <div className="menuBar-logo">
        <a href="/" className="menuBar-logo-link">
          Quest<span className="menuBar-logo-highlight">Code</span>
        </a>
        <span className="menuBar-logo-subtext">클린 코드 학습 플랫폼</span>
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

        <span onClick={() => handleMenuClick('/problems')} className="menuBar-item">
          <FaStar className="menuBar-icon" />
          문제
        </span>

        <span onClick={() => handleMenuClick('/board')} className="menuBar-item">
          <FaChalkboardTeacher className="menuBar-icon" />
          게시판
        </span>

        <span onClick={() => handleMenuClick('/code-status')} className="menuBar-item">
          <FaAlignLeft className="menuBar-icon" />
          채점상황
        </span>
      </div>

      <div className="menuBar-auth">
        {isLoggedIn ? (
          <>
            <a href="/profile" className="menuBar-item">
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
