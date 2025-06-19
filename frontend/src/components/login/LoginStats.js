import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from 'chart.js';
import './LoginStats.css';

// Chart.js 구성 요소 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const LoginStats = () => {
    // 상태 관리: 주간/월간 모드, 선택된 월, 로그인 데이터
    const [mode, setMode] = useState('weekly');
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [loginData, setLoginData] = useState([]);

    // 로그인 통계 데이터 가져오기
    useEffect(() => {
        const fetchLoginData = async () => {
            try {
                let url = '/api/login-stats?';

                // 모드에 따라 URL 구성
                if (mode === 'weekly') {
                    url += `days=7`;
                    setSelectedMonth(new Date().getMonth() + 1);
                } else if (mode === 'monthly') {
                    const year = new Date().getFullYear();
                    if (selectedMonth) {
                        url += `year=${year}&month=${selectedMonth}`;
                    } else {
                        url += `year=${year}&month=${new Date().getMonth() + 1}`;
                    }
                }

                // JWT 토큰을 헤더에 포함하여 API 요청
                const token = localStorage.getItem('token');
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error(`HTTP error ${response.status}`);

                const json = await response.json();

                // 데이터 포맷팅: 날짜별 로그인 횟수를 차트 형식으로 변환
                const formatted = Object.entries(json).map(([dateString, count]) => {
                    const [year, month, day] = dateString.split('-').map(Number);
                    return {
                        date: `${month}/${day}`,
                        count,
                        rawDate: new Date(year, month - 1, day),
                    };
                });

                // 날짜 순으로 정렬
                formatted.sort((a, b) => a.rawDate - b.rawDate);

                setLoginData(formatted);
            } catch (error) {
                console.error('로그인 통계 가져오기 실패:', error);
                setLoginData([]);
            }
        };

        fetchLoginData();
    }, [mode, selectedMonth]); // 모드나 선택된 월이 변경될 때마다 다시 호출

    // Chart.js 바 차트 데이터 구성
    const barData = {
        labels: loginData.map(item => item.date),
        datasets: [
            {
                label: '로그인 횟수',
                data: loginData.map(item => item.count),
                backgroundColor: '#1f4dbfcc',
                borderColor: '#1f4dbf',
                borderWidth: 2,
                borderRadius: 8,
            },
        ],
    };


    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: '로그인 횟수(회)',
                    font: { size: 14, weight: '600' },
                },
            },
            x: {
                title: {
                    display: true,
                    text: '날짜',
                    font: { size: 14, weight: '600' },
                },
            },
        },
        plugins: { legend: { display: false } },
    };

    return (
        <div className="loginstats-container">
            {/* 헤더: 제목, 모드 전환 버튼, 월 선택 버튼 */}
            <div className="loginstats-header">
                <h2 className="loginstats-title">로그인 통계</h2>

                {/* 주간/월간 모드 전환 버튼 */}
                <div className="loginstats-mode-toggle">
                    <button
                        className={mode === 'weekly' ? 'active' : ''}
                        onClick={() => setMode('weekly')}
                    >
                        주간
                    </button>
                    <button
                        className={mode === 'monthly' ? 'active' : ''}
                        onClick={() => setMode('monthly')}
                    >
                        월간
                    </button>
                </div>

                {/* 월간 모드일 때만 표시되는 월 선택 버튼들 */}
                {mode === 'monthly' && (
                    <div className="loginstats-month-buttons">
                        {[...Array(12)].map((_, i) => {
                            const monthNum = i + 1;
                            return (
                                <button
                                    key={monthNum}
                                    className={selectedMonth === monthNum ? 'active' : ''}
                                    onClick={() => setSelectedMonth(monthNum)}
                                >
                                    {monthNum}월
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 메인 레이아웃: 차트와 테이블을 나란히 배치 */}
            <div className="loginstats-layout">
                {/* 바 차트 영역 */}
                <div className="loginstats-chart-box">
                    <Bar data={barData} options={options} />
                </div>

                {/* 데이터 테이블 영역 */}
                <div className="loginstats-table-box">
                    <table className="loginstats-table">
                        <thead>
                            <tr>
                                <th>날짜</th>
                                <th>로그인 횟수</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loginData.length === 0 ? (
                                <tr>
                                    <td colSpan="2" className="loginstats-no-data">
                                        데이터 없음
                                    </td>
                                </tr>
                            ) : (
                                loginData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.date}</td>
                                        <td>{item.count}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LoginStats;