import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import { jwtDecode } from 'jwt-decode';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Profile = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [totalScore, setTotalScore] = useState(0);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserId(decoded.userId);
                setIsAdmin(decoded.role === 'admin' || decoded.role === 'ROLE_ADMIN');
            } catch (err) {
                console.error('토큰 디코딩 실패:', err);
            }
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const scoreRes = await fetch('http://localhost:8080/api/rankings');
                const scoreData = await scoreRes.json();
                const userData = scoreData.find(user => String(user.userId) === String(userId));
                setTotalScore(userData?.totalScore || 0);

                const subRes = await fetch('http://localhost:8080/submissions');
                const subData = await subRes.json();
                setSubmissions(subData.filter(sub => String(sub.userId) === String(userId)));
            } catch (err) {
                console.error('데이터 로딩 실패:', err);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchData();
    }, [userId]);

    if (loading) return <div>불러오는 중...</div>;

    const correctCount = submissions.filter(s => s.status === 'Correct' || s.status === '정확한 풀이').length;
    const wrongCount = submissions.filter(s => s.status === 'Wrong Answer' || s.status === '잘못된 풀이').length;
    const errorCount = submissions.filter(s => s.status === 'Error' || s.status === '컴파일 에러').length;

    const data = {
        labels: ['총 점수', '제출 수', '정답 수', '오답 수', '에러 수'],
        datasets: [
            {
                label: '나의 통계',
                data: [totalScore, submissions.length, correctCount, wrongCount, errorCount],
                backgroundColor: ['#4a90e2', '#7ed6df', '#70a1ff', '#ff6b81', '#ffa502'],
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: true, text: '📊 나의 활동 통계' },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-left">
                    <h1 className="profile-title">프로필 관리</h1>
                    <div className="button-container">
                        <button className="profile-button" onClick={() => navigate('/profile-edit')}>
                            개인정보 수정
                        </button>
                        <button className="profile-button" onClick={() => navigate('/profile-problems')}>
                            생성한 문제
                        </button>
                        <button className="profile-button" onClick={() => navigate('/profile-rules')}>
                            생성한 규칙
                        </button>
                        {isAdmin && (
                            <button className="profile-button2" onClick={() => navigate('/manager')}>
                                관리자 페이지
                            </button>
                        )}
                    </div>
                </div>

                <div className="profile-right">
                    <Bar data={data} options={options} />
                    <div className="statistics-card">
                        <h3>📊 통계</h3>
                        <div className="statistics-text">
                            <p><strong>총 점수:</strong> {totalScore}</p>
                            <p><strong>제출 수:</strong> {submissions.length}</p>
                            <p><strong>정답 수:</strong> {correctCount}</p>
                            <p><strong>오답 수:</strong> {wrongCount}</p>
                            <p><strong>에러 수:</strong> {errorCount}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
