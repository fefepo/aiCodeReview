import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';
import SummarySection from './SummarySection';

const slides = [
  { title: "AI 기반 코드 분석", description: "정확하고 스마트한 코드 진단", image: "/main_page/Slide01.png" },
  { title: "수정과 피드백", description: "제출 후 AI 피드백을 통해 실력 향상", image: "/main_page/Slide02.jpg" },
  { title: "수 많은 문제 풀이", description: "문제 풀이를 통해 실시간 실력 확인", image: "/main_page/Slide03.png" },
];

function MainPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // 추가
  const [rankings, setRankings] = useState([]);
  const [problems, setProblems] = useState([]);
  const [posts, setPosts] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchAll = async () => {
      try {
        const [rankRes, probRes, postRes, subRes] = await Promise.all([
          fetch('http://localhost:8080/api/rankings'),
          fetch('http://localhost:8080/problems'),
          fetch('http://localhost:8080/api/board/list'),
          fetch('http://localhost:8080/submissions'),
        ]);

        const [rankData, probData, postData, subData] = await Promise.all([
          rankRes.json(), probRes.json(), postRes.json(), subRes.json()
        ]);

        const sortedRank = rankData
          .sort((a, b) => b.totalScore - a.totalScore)
          .map((item, index) => ({ ...item, userRank: index + 1 }));

        const sortedSubs = subData.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

        setRankings(sortedRank);
        setProblems(probData);
        setPosts(postData);
        setSubmissions(sortedSubs);
      } catch (e) {
        console.error("데이터 불러오기 실패", e);
      }
    };

    fetchAll();
  }, []);

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
      {/* 슬라이드 섹션 */}
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

      {/* 아이콘 버튼 섹션 */}
      <div className="icon-button-grid">
        <div className="icon-box" onClick={() => navigate('/')}>
          <img src="/main_page/Problem.png" alt="가이드" />
          <span>가이드 이동</span>
        </div>

        <div className="icon-box" onClick={() => navigate('/ranking')}>
          <img src="/main_page/Ranking.png" alt="순위" />
          <span>순위 이동</span>
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
          <span>업적 이동</span>
        </div>

        <div className="icon-box" onClick={() => navigate('/problems')}>
          <img src="/main_page/Problem.png" alt="문제" />
          <span>문제 목록 이동</span>
        </div>

        <div className="icon-box" onClick={() => navigate('/board')}>
          <img src="/main_page/Board.png" alt="게시판" />
          <span>게시판 이동</span>
        </div>

        <div className="icon-box" onClick={() => navigate('/code-status')}>
          <img src="/main_page/Grading.png" alt="채점상황" />
          <span>채점상황 이동</span>
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


      {/* 2x2 그리드 섹션 */}
      <div className="grid-container">
        {/* 최신 게시글 섹션 */}
        <SummarySection
          title="최신 게시글"
          items={posts}
          moreLink="/board"
          renderItem={(post) => (
            <div
              key={post.id}
              className="mainpage-list-row"
              onClick={() => {
                if (isLoggedIn) {
                  navigate(`/board/${post.id}`);
                } else {
                  alert('로그인이 필요합니다.');
                  navigate('/login');
                }
              }}
            >
              <span className="mainpage-badge">NEW</span>
              <span className="mainpage-list-title">{post.title}</span>
              <span className="mainpage-list-info">
                {post.writer} · {new Date(post.createdAt).toLocaleDateString('ko-KR')}
              </span>
            </div>
          )}
        />

        {/* 채점 현황 섹션 */}
        <SummarySection
          title="채점 현황"
          items={submissions}
          moreLink="/code-status"
          renderItem={(submission) => (
            <div
              key={submission.id}
              className="mainpage-list-row"
              onClick={() => navigate(`/problems/${submission.problemId}`)}
            >
              <span className="mainpage-status-badge">{submission.status}</span>
              <span className="mainpage-list-title">
                {submission.language}
              </span>
              <span className="mainpage-list-info">
                {new Date(submission.submittedAt).toLocaleDateString('ko-KR')}
              </span>
            </div>
          )}
        />

        {/* 상위 랭커 섹션 */}
        <SummarySection
          title="상위 랭커"
          items={rankings}
          moreLink="/ranking"
          renderItem={(rank) => {
            const rankClass =
              rank.userRank === 1
                ? 'gold'
                : rank.userRank === 2
                  ? 'silver'
                  : rank.userRank === 3
                    ? 'bronze'
                    : 'gray';

            return (
              <div className="mainpage-list-row" key={rank.userRank}>
                <span className={`mainpage-badge ${rankClass}`}>{rank.userRank}위</span>
                <span className="mainpage-list-title">
                  {rank.user?.username || '알 수 없음'}
                </span>
                <span className="mainpage-list-info">
                  점수: {rank.totalScore}
                </span>
              </div>
            );
          }}
        />


        {/* 문제 목록 섹션 */}
        <SummarySection
          title="문제 목록"
          items={problems}
          moreLink="/problems"
          renderItem={(problem) => (
            <div
              className="mainpage-list-row"
              key={problem.id}
              onClick={() => navigate(`/problems/${problem.id}`)}
            >
              <span className="mainpage-list-title">{problem.title}</span>
              <span className="mainpage-list-info">작성자: {problem.createdBy}</span>
            </div>
          )}
        />
      </div>

    </div>
  );
}

export default MainPage;
