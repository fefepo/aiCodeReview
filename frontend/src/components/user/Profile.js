import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css'; // 스타일을 위한 CSS 파일 (선택 사항)

const Profile = () => {
    const navigate = useNavigate();

    return (
        <div className="profile-container">
            <h1 className="profile-title">프로필 관리</h1>

            <div className="button-container">
                <button className="profile-button" onClick={() => navigate('/profile-edit')}>
                    프로필 수정
                </button>
                <button className="profile-button" onClick={() => navigate('/profile-problems')}>
                    생성한 문제 목록
                </button>
            </div>
        </div>
    );
}

export default Profile;
