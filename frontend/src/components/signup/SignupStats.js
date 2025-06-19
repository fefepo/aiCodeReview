import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import './SignupStats.css';

// 차트 플러그인 등록
ChartJS.register(ArcElement, Tooltip, Legend);

const SignupStats = () => {
    const [year, setYear] = useState(2025);           // 초기 연도
    const [monthlyData, setMonthlyData] = useState([]); // 월별 데이터
    const [loading, setLoading] = useState(true);     // 로딩 상태
    const [error, setError] = useState(null);         // 에러 상태

    // 🎨 월별 색상 배열 (1월 ~ 12월)
    const seasonalColors = [
        '#FFCCCC', '#FF6666', '#FFB266', '#FF7F00',
        '#FFFF99', '#FFFF00', '#99FF99', '#00CC00',
        '#9999FF', '#0000FF', '#666699', '#000080'
    ];

    //  API 호출: 연도별 회원가입 통계 조회
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

    //  연도 선택 변경 핸들러
    const handleYearChange = (e) => {
        setYear(parseInt(e.target.value));
    };

    // 로딩/에러/데이터 없음 처리
    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">오류 발생: {error}</div>;
    if (!monthlyData.length) return <div className="no-data">데이터가 없습니다.</div>;

    //  Pie 차트 라벨 (YYYY-MM 형식)
    const formattedLabels = monthlyData.map(d => {
        const monthStr = d.month < 10 ? `0${d.month}` : `${d.month}`;
        return `${year}-${monthStr}`;
    });

    //  차트 데이터 구성
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

            {/* 연도 선택 셀렉트박스 */}
            <div className="year-select-container">
                <label htmlFor="year-select">연도 선택: </label>
                <select id="year-select" value={year} onChange={handleYearChange}>
                    <option value={2024}>2024</option>
                    <option value={2025}>2025</option>
                </select>
            </div>

            <div className="stats-layout">
                {/* 원형 차트 영역 */}
                <div className="chart-box" style={{ height: '400px' }}>
                    <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>

                {/* 표 형식 데이터 영역 */}
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
