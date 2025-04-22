import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AdminRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const decoded = jwtDecode(token);
        if (decoded.role === 'admin' || decoded.role === 'ROLE_ADMIN') {
            return children;
        }
        return <Navigate to="/unauthorized" replace />;
    } catch (error) {
        console.error("토큰 디코딩 에러:", error);
        return <Navigate to="/login" replace />;
    }
};

export default AdminRoute;