import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // JWT 토큰을 디코딩하는 라이브러리

// 관리자 전용 라우트 보호 컴포넌트
const AdminRoute = ({ children }) => {
    const token = localStorage.getItem('token'); // 저장된 토큰 가져오기

    // 1. 토큰 없으면 로그인 페이지로 리디렉션
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        // 2. 토큰 디코딩 후 역할 확인
        const decoded = jwtDecode(token);

        // 3. 역할이 admin 또는 ROLE_ADMIN이면 접근 허용
        if (decoded.role === 'admin' || decoded.role === 'ROLE_ADMIN') {
            return children;
        }

        // 4. 관리자 권한이 아니면 접근 거부 페이지로 이동
        return <Navigate to="/unauthorized" replace />;
    } catch (error) {
        // 5. 토큰 디코딩 실패 시 로그인 페이지로 이동
        console.error("토큰 디코딩 에러:", error);
        return <Navigate to="/login" replace />;
    }
};

export default AdminRoute;
