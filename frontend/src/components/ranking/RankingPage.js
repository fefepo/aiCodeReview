import React, { useEffect, useState } from 'react';
import './RankingPage.css';

const RankingPage = () => {
  // 상태 변수 정의
  const [rankings, setRankings] = useState([]); // 랭킹 목록 저장
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [error, setError] = useState(null);     // 오류 상태 관리

  // 컴포넌트가 마운트될 때 API 요청하여 랭킹 데이터를 가져옴
  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/rankings');

        if (!response.ok) {
          throw new Error('네트워크 응답이 좋지 않습니다.');
        }

        const data = await response.json();
        // Total Score 기준으로 내림차순 정렬 후 Rank 설정
        const sortedData = data
          .sort((a, b) => b.totalScore - a.totalScore)
          .map((item, index) => ({
            ...item,
            userRank: index + 1,         // 랭킹 순위 설정
            userId: String(item.userId), // 사용자 ID는 문자열로 변환
          }));

        setRankings(sortedData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  // 점수에 따른 등급을 반환하는 함수
  const getRankLabel = (score) => {
    if (score > 99) {
      return 'Diamond';
    } else if (score > 49) {
      return 'Platinum';
    } else if (score > 29) {
      return 'Gold';
    } else if (score > 9) {
      return 'Silver';
    } else if (score > 2) {
      return 'Bronze';
    }
    return 'Newbie';
  };

  // 등급별 설명 데이터
  const rankTiers = [
    { threshold: 0, label: 'Newbie', className: 'Newbie' },
    { threshold: 3, label: 'Bronze', className: 'Bronze' },
    { threshold: 10, label: 'Silver', className: 'Silver' },
    { threshold: 30, label: 'Gold', className: 'Gold' },
    { threshold: 50, label: 'Platinum', className: 'Platinum' },
    { threshold: 100, label: 'Diamond', className: 'Diamond' },
  ];

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>오류: {error}</div>;
  }

  return (
    <div className="app-container">
      <div className="ranking-page">
        {/* 등급 설명 */}
        <div className="ranking-description">
          <h3>📊 점수에 따른 등급 시스템</h3>
          <div className="tier-list">
            {rankTiers.map((tier, index) => (
              <div key={index} className="tier-item">
                <span className="tier-threshold">{tier.threshold}점</span>
                <span className={`tier-label ${tier.className}`}>{tier.label}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Ranking Table */}
        <div className="ranking-table">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>User Id</th>
                <th>Total Score</th>
                <th>등급</th> {/* 등급 열 추가 */}
              </tr>
            </thead>
            <tbody>
              {rankings.map((ranking, index) => {
                const rankLabel = getRankLabel(ranking.totalScore);
                const isTopThree = ranking.userRank <= 3; // 3명 대신 1명만 해 놓음

                return (
                  <tr key={index} className={isTopThree ? `top-rank rank-${ranking.userRank}` : ''}>
                    <td>
                      {ranking.userRank === 1 && '🥇 '}
                      {ranking.userRank === 2 && '🥈 '}
                      {ranking.userRank === 3 && '🥉 '}
                      {ranking.userRank}
                    </td>
                    <td>{ranking.user.username}</td>
                    <td>{ranking.totalScore}</td>
                    <td className={rankLabel}>{rankLabel}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RankingPage;
