import React, { useEffect, useState } from 'react';
import './MainPage.css';
import { FaSearch, FaPencilAlt, FaCheckCircle } from 'react-icons/fa';

// 모든 이미지들 (gif와 jpg)을 배열에 포함
const images = [
  "/test1.png",
  "/test2.png",
  "/test3.png",
  "/test4.png",
];

function MainPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000); // 10초 간격으로 이미지 변경

    return () => clearInterval(interval); // 컴포넌트가 언마운트될 때 interval 클리어
  }, []);

  return (
    <div className="mainPage-App" style={{ backgroundImage: `url(${images[currentImageIndex]})` }}>
      {/* 배경 이미지를 동적으로 변경 */}
      <header className="mainPage-header">
        <div className="mainPage-header-content">
          <div className="mainPage-spring-label">4학년 1학기 종합프로젝트</div>
          <h1>AI 기반 코드 리뷰<br /> 클린 코드 학습 플랫폼</h1>
          <h2>Quest<span className="review">Code</span></h2>
          <p>작성한 코드를 분석, 수정, 채점받을 수 있는 곳입니다</p>
        </div>
      </header>

      {/* 분석, 수정, 채점 박스 섹션 */}
      <div className="box-container">
        <div className="box">
          <img src="/analyze.png" className="box-icon1" />
          <div className="box-title">분석</div>
          <div className="box-subtitle">코드제출을 통해 코드를 정확하게 분석합니다</div>
        </div>

        <div className="box">
          <img src="/edit.png" className="box-icon2" />
          <div className="box-title">수정</div>
          <div className="box-subtitle">제출 코드 목록에서 본인의 코드를 수정할 수 있습니다</div>
        </div>

        <div className="box">
          <img src="/score.png" className="box-icon3" />
          <div className="box-title">채점</div>
          <div className="box-subtitle">코드를 제출하면 해당 코드를 채점합니다</div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
