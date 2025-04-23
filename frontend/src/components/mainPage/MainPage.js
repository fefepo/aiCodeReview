import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';

const slides = [
  { title: "AI 기반 코드 분석", description: "정확하고 스마트한 코드 진단", image: "/main_page/Slide01.png" },
  { title: "수정과 피드백", description: "제출 후 AI 피드백을 통해 실력 향상", image: "/main_page/Slide02.jpg" },
  { title: "수 많은 문제 풀이", description: "문제 풀이를 통해 실시간 실력 확인", image: "/main_page/Slide03.png" },
];

function MainPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mainPage">
      <div className="carousel">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="carousel-overlay">
              <h2>{slide.title}</h2>
              <p>{slide.description}</p>
            </div>
          </div>
        ))}
        <div className="carousel-slide-counter">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>

      <div className="icon-button-grid">
        <div className="icon-box" onClick={() => navigate('/ranking')}>
          <img src="/main_page/Ranking.png" alt="순위" />
          <span>순위 확인</span>
        </div>

        <div className="icon-box" onClick={() => {
          if (!isLoggedIn) {
            alert('로그인이 필요합니다.');
            navigate('/login');
          } else {
            navigate('/achievement');
          }
        }}>
          <img src="/main_page/Achievement.png" alt="업적" />
          <span>업적 확인</span>
        </div>

        <div className="icon-box" onClick={() => navigate('/problems')}>
          <img src="/main_page/Problem.png" alt="문제" />
          <span>문제 풀기</span>
        </div>

        <div className="icon-box" onClick={() => navigate('/board')}>
          <img src="/main_page/Board.png" alt="게시판" />
          <span>게시판 이동</span>
        </div>

        <div className="icon-box" onClick={() => navigate('/code-status')}>
          <img src="/main_page/Grading.png" alt="채점상황" />
          <span>채점상황 확인</span>
        </div>

        <div className="icon-box" onClick={() => {
          if (!isLoggedIn) {
            alert('로그인이 필요합니다.');
            navigate('/login');
          } else {
            navigate('/profile');
          }
        }}>
          <img src="/main_page/Profile.png" alt="프로필" />
          <span>프로필 이동</span>
        </div>
      </div>

      <div className="features-inline">
        <div className="feature-item">
          <img src="/analyze.png" alt="분석 아이콘" />
          <h3>분석</h3>
          <p>AI가 코드를 분석하여 정확하게 진단해줍니다.</p>
        </div>
        <div className="feature-item">
          <img src="/edit.png" alt="수정 아이콘" />
          <h3>수정</h3>
          <p>제출한 코드를 기반으로 클린 코드 가이드를 제공합니다.</p>
        </div>
        <div className="feature-item">
          <img src="/score.png" alt="채점 아이콘" />
          <h3>채점</h3>
          <p>자동 채점을 통해 코딩 실력을 빠르게 피드백합니다.</p>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
