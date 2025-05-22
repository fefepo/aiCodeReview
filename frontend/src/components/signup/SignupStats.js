import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import './SignupStats.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const SignupStats = () => {
    const [year, setYear] = useState(2025);  // 초기 연도 설정
    const [monthlyData, setMonthlyData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 계절별 월별 색상 배열 (1월부터 12월)
    const seasonalColors = [
        '#FFCCCC', // 1월 - 연한 빨강
        '#FF6666', // 2월 - 진한 빨강
        '#FFB266', // 3월 - 연한 주황
        '#FF7F00', // 4월 - 진한 주황
        '#FFFF99', // 5월 - 연한 노랑
        '#FFFF00', // 6월 - 진한 노랑
        '#99FF99', // 7월 - 연한 초록
        '#00CC00', // 8월 - 진한 초록
        '#9999FF', // 9월 - 연한 파랑
        '#0000FF', // 10월 - 진한 파랑
        '#666699', // 11월 - 연한 남색
        '#000080', // 12월 - 진한 남색
    ];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`http://localhost:8080/api/signup-stats?year=${year}`);
                if (!res.ok) throw new Error('데이터를 가져오는 중 오류 발생');

                const data = await res.json();
                console.log('API에서 받은 데이터:', data);
                setMonthlyData(data);
            } catch (err) {
                console.error('fetch 에러:', err);
                setError(err.message);
                setMonthlyData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [year]);

    const handleYearChange = (e) => {
        setYear(parseInt(e.target.value));
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">오류 발생: {error}</div>;
    if (!monthlyData.length) return <div className="no-data">데이터가 없습니다.</div>;

    const formattedLabels = monthlyData.map(d => {
        const monthStr = d.month < 10 ? `0${d.month}` : `${d.month}`;
        return `${year}-${monthStr}`;
    });

    const pieData = {
        labels: formattedLabels,
        datasets: [
            {
                label: '회원가입 수',
                data: monthlyData.map(d => d.count),
                backgroundColor: seasonalColors,
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="container">
            <h2 className="title">회원가입 통계</h2>

            {/* 연도 선택 */}
            <div className="year-select-container">
                <label htmlFor="year-select">연도 선택: </label>
                <select id="year-select" value={year} onChange={handleYearChange}>
                    <option value={2024}>2024</option>
                    <option value={2025}>2025</option>
                </select>
            </div>

            <div className="stats-layout">
                <div className="chart-box" style={{ height: '400px' }}>
                    <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>

                <div className="table-box">
                    <table className="stats-table">
                        <thead>
                            <tr>
                                <th>월</th>
                                <th>회원가입 수</th>
                            </tr>
                        </thead>
                        <tbody>
                            {monthlyData.map(({ month, count }, idx) => {
                                const monthStr = month < 10 ? `0${month}` : `${month}`;
                                return (
                                    <tr key={idx}>
                                        <td>{`${year}-${monthStr}`}</td>
                                        <td className="count">{count}</td>
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

export default SignupStats;
