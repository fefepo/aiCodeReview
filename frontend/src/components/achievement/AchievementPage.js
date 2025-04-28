import React, { useEffect, useState } from 'react';
import './AchievementPage.css';
import { jwtDecode } from 'jwt-decode';

const AchievementsPage = () => {
  const [userId, setUserId] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const allAchievements = [
    { minScore: 1, title: "🏅 새로운 시작", description: "첫 점수를 획득했습니다!" },
    { minScore: 3, title: "📘 초보 학습자", description: "3점을 넘겼습니다. 좋은 출발입니다!" },
    { minScore: 15, title: "🧠 꾸준한 탐험가", description: "학습 여정을 계속 이어가고 있군요!" },
    { minScore: 30, title: "🌟 성장하는 도전자", description: "많은 문제를 해결하며 실력을 쌓고 있습니다." },
    { minScore: 50, title: "🔥 알고리즘 마스터", description: "고수의 반열에 올랐습니다. 축하합니다!" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.userId);
      } catch (error) {
        console.error("토큰 디코딩 실패:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchScore = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/rankings');
        if (!response.ok) throw new Error("랭킹 정보를 불러올 수 없습니다.");

        const data = await response.json();
        const userData = data.find(user => String(user.userId) === String(userId));
        setTotalScore(userData?.totalScore || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchScore();
  }, [userId]);

  const unlockedAchievements = allAchievements.filter(ach => totalScore >= ach.minScore);

  if (loading) return <div>업적을 불러오는 중...</div>;
  if (error) return <div>오류: {error}</div>;

  return (
    <div className="achievement-page">
      <h1>🏆 나의 업적</h1>
      <p>총 점수: {totalScore}</p>

      {/* 업적 카드 */}
      <div className="achievement-table">
        {unlockedAchievements.length === 0 ? (
          <div className="no-achievements">
            아직 달성한 업적이 없습니다. 문제를 풀어보세요!
          </div>
        ) : (
          unlockedAchievements.map((ach, index) => (
            <div key={index} className="achievement-card">
              <h3>{ach.title}</h3>
              <p>{ach.description}</p>
              <span className="condition">조건: 총 점수 {ach.minScore}점 이상</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AchievementsPage;
