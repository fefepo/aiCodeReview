import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './ManagerPage.css';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

// GPU 카드 컴포넌트
const GpuCard = ({ gpuId, gpuName, recentLogs }) => {
    // 로그 데이터 정렬 (시간순)
    const sortedLogs = [...recentLogs].sort((a, b) =>
        new Date(a.createdAt) - new Date(b.createdAt));

    // 차트 데이터 준비
    const labels = sortedLogs.map(log => {
        const date = new Date(log.createdAt);
        return date.toLocaleTimeString();
    });

    const avgUtils = sortedLogs.map(log => log.avgGpuUtil);
    const maxUtils = sortedLogs.map(log => log.maxGpuUtil);
    const avgMems = sortedLogs.map(log => log.avgGpuMemory);
    const maxMems = sortedLogs.map(log => log.maxGpuMemory);

    // 최신 로그 값
    const latestLog = sortedLogs.length > 0 ? sortedLogs[sortedLogs.length - 1] : null;

    // GPU 사용률 차트 데이터
    const utilChartData = {
        labels,
        datasets: [
            {
                label: '평균 GPU 사용률 (%)',
                data: avgUtils,
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderWidth: 2,
                tension: 0.2,
                fill: true
            },
            {
                label: '최대 GPU 사용률 (%)',
                data: maxUtils,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 2,
                tension: 0.2,
                fill: false
            }
        ]
    };

    // 메모리 사용률 차트 데이터
    const memChartData = {
        labels,
        datasets: [
            {
                label: '평균 메모리 사용률 (%)',
                data: avgMems,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                tension: 0.2,
                fill: true
            },
            {
                label: '최대 메모리 사용률 (%)',
                data: maxMems,
                borderColor: 'rgb(255, 159, 64)',
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderWidth: 2,
                tension: 0.2,
                fill: false
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                title: {
                    display: true,
                    text: '사용률 (%)'
                }
            }
        }
    };

    return (
        <div className="gpu-card">
            <h2>{gpuName} (GPU {gpuId})</h2>
            <div className="stats">
                <div className="stat-box">
                    <div className="stat-value">
                        {latestLog ? `${latestLog.avgGpuUtil.toFixed(1)}%` : '0%'}
                    </div>
                    <div className="stat-label">평균 GPU 사용률</div>
                </div>
                <div className="stat-box">
                    <div className="stat-value">
                        {latestLog ? `${latestLog.maxGpuUtil.toFixed(1)}%` : '0%'}
                    </div>
                    <div className="stat-label">최대 GPU 사용률</div>
                </div>
                <div className="stat-box">
                    <div className="stat-value">
                        {latestLog ? `${latestLog.avgGpuMemory.toFixed(1)}%` : '0%'}
                    </div>
                    <div className="stat-label">평균 메모리 사용률</div>
                </div>
                <div className="stat-box">
                    <div className="stat-value">
                        {latestLog ? `${latestLog.maxGpuMemory.toFixed(1)}%` : '0%'}
                    </div>
                    <div className="stat-label">최대 메모리 사용률</div>
                </div>
            </div>
            <div className="chart-container">
                <div className="chart">
                    <Line data={utilChartData} options={chartOptions} />
                </div>
                <div className="chart">
                    <Line data={memChartData} options={chartOptions} />
                </div>
            </div>
        </div>
    );
};

// 추이 차트 컴포넌트
const TrendChart = ({ trendData }) => {
    const { timeLabels, avgGpuUtils, maxGpuUtils } = trendData;

    const chartData = {
        labels: timeLabels,
        datasets: [
            {
                label: '평균 GPU 사용률 (%)',
                data: avgGpuUtils,
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderWidth: 2,
                tension: 0.2,
                fill: true
            },
            {
                label: '최대 GPU 사용률 (%)',
                data: maxGpuUtils,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 2,
                tension: 0.2,
                fill: false
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                title: {
                    display: true,
                    text: '사용률 (%)'
                }
            }
        }
    };

    return (
        <div className="chart-wrapper">
            <Line data={chartData} options={chartOptions} />
        </div>
    );
};

// 메인 관리자 페이지 컴포넌트
const ManagerPage = () => {
    const [monitoringData, setMonitoringData] = useState([]);
    const [gpuCards, setGpuCards] = useState([]);
    const [trendData, setTrendData] = useState({
        timeLabels: [],
        avgGpuUtils: [],
        maxGpuUtils: []
    });
    const [timeRange, setTimeRange] = useState('day');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [countdown, setCountdown] = useState(30);
    const navigate = useNavigate();

    // 카운트다운 타이머 참조
    const countdownTimerRef = useRef(null);

    const startCountdown = useCallback(() => {
        if (countdownTimerRef.current) {
            clearInterval(countdownTimerRef.current);
        }

        setCountdown(30);
        countdownTimerRef.current = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    fetchGpuCardData();
                    fetchGpuTrends();
                    return 30;
                }
                return prev - 1;
            });
        }, 1000);
    }, []);

    // 카운트다운 재설정 함수
    const resetCountdown = useCallback(() => {
        setCountdown(30);
    }, []);

    // GPU 카드 데이터 가져오기 - useCallback으로 메모이제이션
    const fetchGpuCardData = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:8080/api/admin/cards');
            const data = await response.json();

            if (Array.isArray(data)) {
                setGpuCards(data);
            } else {
                console.error('Unexpected GPU card data format:', data);
            }

            resetCountdown();
        } catch (error) {
            console.error('GPU 카드 데이터 가져오기 오류:', error);
        }
    }, [resetCountdown]);

    const fetchGpuTrends = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:8080/api/admin/trends');
            const data = await response.json();

            setTrendData({
                timeLabels: data.timeLabels || [],
                avgGpuUtils: data.avgGpuUtils || [],
                maxGpuUtils: data.maxGpuUtils || []
            });
        } catch (error) {
            console.error('GPU 추이 가져오기 오류:', error);
        }
    }, []);

    // 모니터링 데이터 가져오기 - useCallback으로 메모이제이션
    const fetchMonitoringData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/api/admin/data?timeRange=${timeRange}`);
            const data = await response.json();

            if (data && Array.isArray(data)) {
                setMonitoringData(data);
                setError(null);
            } else {
                console.error('Unexpected monitoring data format:', data);
                setMonitoringData([]);
                setError('데이터 형식이 올바르지 않습니다.');
            }
        } catch (err) {
            console.error('Error fetching monitoring data:', err);
            setError('데이터를 불러오는 중 오류가 발생했습니다.');
            setMonitoringData([]);
        } finally {
            setLoading(false);
        }
    }, [timeRange]);

    // 컴포넌트 마운트 시 데이터 로드 및 타이머 설정
    useEffect(() => {
        // 초기 데이터 로드
        fetchGpuCardData();
        fetchGpuTrends();
        fetchMonitoringData();

        // 자동 새로고침 설정
        const monitoringInterval = setInterval(fetchMonitoringData, 60000);
        const gpuDataInterval = setInterval(() => {
            fetchGpuCardData();
            fetchGpuTrends();
        }, 30000);

        // 카운트다운 타이머 시작
        startCountdown();

        // 컴포넌트 언마운트 시 정리
        return () => {
            clearInterval(monitoringInterval);
            clearInterval(gpuDataInterval);
            if (countdownTimerRef.current) {
                clearInterval(countdownTimerRef.current);
            }
        };
    }, [timeRange, fetchGpuCardData, fetchGpuTrends, fetchMonitoringData, startCountdown]);

    // 시간 포맷팅 함수
    const formatDateTime = (timestamp) => {
        if (!timestamp) return '';

        const date = new Date(timestamp);
        return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    // GPU 사용량 차트 데이터
    const gpuUsageChartData = {
        labels: monitoringData?.map(item => formatDateTime(item.timestamp)) || [],
        datasets: [
            {
                label: 'GPU 사용량 (%)',
                data: monitoringData?.map(item => item.gpuUsage) || [],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
                fill: true,
            }
        ]
    };

    // AI 응답 처리시간 차트 데이터
    const responseTimeChartData = {
        labels: monitoringData?.map(item => formatDateTime(item.timestamp)) || [],
        datasets: [
            {
                label: 'AI 응답 처리시간 (ms)',
                data: monitoringData?.map(item => item.responseTime) || [],
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                tension: 0.4,
                fill: true,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };

    // 통계 지표 (예시 데이터)
    const metrics = [
        { label: 'User 수', value: 88 },
        { label: '구독자 수', value: 24 },
        { label: '총 매출', value: '115,600' },
        { label: '게시글 수', value: 43 },
    ];

    // 통계 계산 함수
    const calculateStats = (dataKey) => {
        if (!monitoringData || monitoringData.length === 0) return { avg: 0, max: 0, min: 0 };

        const values = monitoringData.map(item => item[dataKey]).filter(val => val !== undefined && val !== null);

        if (values.length === 0) return { avg: 0, max: 0, min: 0 };

        const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
        const max = Math.max(...values);
        const min = Math.min(...values);

        return { avg, max, min };
    };

    const gpuStats = calculateStats('gpuUsage');
    const responseTimeStats = calculateStats('responseTime');

    // 새로고침 핸들러
    const handleRefresh = useCallback(() => {
        fetchMonitoringData();
        fetchGpuCardData();
        fetchGpuTrends();
        resetCountdown();
    }, [fetchMonitoringData, fetchGpuCardData, fetchGpuTrends, resetCountdown]);

    return (
        <div className="manager-container">
            <header className="manager-header">
                <h1>GPU 및 AI 응답시간 모니터링</h1>
                <div className="time-filter">
                    <button
                        className={timeRange === 'day' ? 'active' : ''}
                        onClick={() => setTimeRange('day')}
                    >
                        일간
                    </button>
                    <button
                        className={timeRange === 'week' ? 'active' : ''}
                        onClick={() => setTimeRange('week')}
                    >
                        주간
                    </button>
                    <button
                        className={timeRange === 'month' ? 'active' : ''}
                        onClick={() => setTimeRange('month')}
                    >
                        월간
                    </button>
                    <button className="refresh-btn" onClick={handleRefresh}>
                        새로고침
                    </button>
                </div>
            </header>

            <div className="metrics">
                {metrics.map((m, i) => (
                    <div key={i} className="metric-box">
                        <div className="metric-label">{m.label}</div>
                        <div className="metric-value">{m.value}</div>
                    </div>
                ))}
            </div>

            {/* GPU 모니터링 섹션 */}
            <div className="gpu-section">
                <h2>GPU 모니터링</h2>
                <div className="refresh-info">자동 새로고침: <span>{countdown}</span>초</div>

                <div className="gpu-container">
                    {gpuCards.map(card => (
                        <GpuCard
                            key={card.gpuId}
                            gpuId={card.gpuId}
                            gpuName={card.gpuName}
                            recentLogs={card.recentLogs}
                        />
                    ))}
                </div>

                <div className="gpu-trend-section">
                    <h2>GPU 사용률 추이</h2>
                    <TrendChart trendData={trendData} />
                </div>
            </div>

            {/* 모니터링 데이터 섹션 */}
            {loading ? (
                <div className="loading-indicator">데이터를 불러오는 중...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : monitoringData && monitoringData.length > 0 ? (
                <div className="dashboard-content">
                    <div className="stats-cards">
                        <div className="stat-card">
                            <h3>GPU 사용량</h3>
                            <div className="stat-values">
                                <div className="stat-item">
                                    <span className="stat-label">평균:</span>
                                    <span className="stat-value">{gpuStats.avg.toFixed(2)}%</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">최대:</span>
                                    <span className="stat-value">{gpuStats.max.toFixed(2)}%</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">최소:</span>
                                    <span className="stat-value">{gpuStats.min.toFixed(2)}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <h3>AI 응답시간</h3>
                            <div className="stat-values">
                                <div className="stat-item">
                                    <span className="stat-label">평균:</span>
                                    <span className="stat-value">{responseTimeStats.avg.toFixed(2)} ms</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">최대:</span>
                                    <span className="stat-value">{responseTimeStats.max.toFixed(2)} ms</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">최소:</span>
                                    <span className="stat-value">{responseTimeStats.min.toFixed(2)} ms</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="charts-container">
                        <div className="chart-wrapper">
                            <h2>GPU 사용량 추이</h2>
                            <div className="chart">
                                <Line data={gpuUsageChartData} options={chartOptions} />
                            </div>
                        </div>

                        <div className="chart-wrapper">
                            <h2>AI 응답 처리시간 추이</h2>
                            <div className="chart">
                                <Line data={responseTimeChartData} options={chartOptions} />
                            </div>
                        </div>
                    </div>

                    <div className="data-table-section">
                        <h2>최근 모니터링 데이터</h2>
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>시간</th>
                                        <th>GPU 사용량 (%)</th>
                                        <th>응답 처리시간 (ms)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {monitoringData.slice(0, 10).map((item, index) => (
                                        <tr key={index}>
                                            <td>{formatDateTime(item.timestamp)}</td>
                                            <td>{item.gpuUsage !== undefined ? item.gpuUsage.toFixed(2) : 'N/A'}%</td>
                                            <td>{item.responseTime !== undefined ? item.responseTime.toFixed(2) : 'N/A'} ms</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="no-data-message">표시할 데이터가 없습니다.</div>
            )}

            {/* 우측 하단 버튼 */}
            <div className="button-container">
                <button
                    className="approval-button"
                    onClick={() => navigate('/admin-approval')}
                >
                    문제 승인·거절 바로가기
                </button>
            </div>
        </div>
    );
};

export default ManagerPage;