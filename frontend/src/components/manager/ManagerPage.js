import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ManagerPage.css';

const ManagerPage = () => {
    const navigate = useNavigate();

    // 나중에 API에서 받아온 실제 값을 넣으시면 됩니다.
    const metrics = [
        { label: 'User 수', value: 6 },
        { label: '구독자 수', value: 4 },
        { label: '총 매출', value: '$15600' },
        { label: '게시글 수', value: 3 },
    ];

    return (
        <div className="manager-container">
            <h1 className="manager-title">ADMIN</h1>
            <div className="metrics">
                {metrics.map((m, i) => (
                    <div key={i} className="metric-box">
                        <div className="metric-label">{m.label}</div>
                        <div className="metric-value">{m.value}</div>
                    </div>
                ))}
            </div>

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
