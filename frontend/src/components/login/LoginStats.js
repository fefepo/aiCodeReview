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

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const LoginStats = () => {
    const [mode, setMode] = useState('weekly');
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [loginData, setLoginData] = useState([]);

    useEffect(() => {
        const fetchLoginData = async () => {
            try {
                let url = '/api/login-stats?';

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

                const token = localStorage.getItem('token');
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error(`HTTP error ${response.status}`);

                const json = await response.json();

                const formatted = Object.entries(json).map(([dateString, count]) => {
                    const [year, month, day] = dateString.split('-').map(Number);
                    return {
                        date: `${month}/${day}`,
                        count,
                        rawDate: new Date(year, month - 1, day),
                    };
                });

                formatted.sort((a, b) => a.rawDate - b.rawDate);

                setLoginData(formatted);
            } catch (error) {
                console.error('로그인 통계 가져오기 실패:', error);
                setLoginData([]);
            }
        };

        fetchLoginData();
    }, [mode, selectedMonth]);

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
            <div className="loginstats-header">
                <h2 className="loginstats-title">로그인 통계</h2>
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

            <div className="loginstats-layout">
                <div className="loginstats-chart-box">
                    <Bar data={barData} options={options} />
                </div>
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
