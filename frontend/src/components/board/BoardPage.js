import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BoardPage.css';

const BoardPage = () => {
    const [postData, setPostData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const postsPerPage = 10;
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            setIsAuthenticated(false);
            setTimeout(() => {
                navigate('/login', { state: { from: location.pathname } });
            }, 2000);
            return;
        }

        const fetchPosts = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/board/list', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!res.ok) throw new Error('게시글 불러오기 실패');
                const data = await res.json();
                setPostData(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchPosts();
    }, [location.pathname, navigate]);

    const totalPages = Math.ceil(postData.length / postsPerPage);
    const startIdx = (currentPage - 1) * postsPerPage;
    const currentPosts = postData.slice(startIdx, startIdx + postsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="unauthenticated">
                <h2>🔒 로그인 후 이용해 주세요.</h2>
                <p>잠시 후 로그인 페이지로 이동합니다...</p>
            </div>
        );
    }

    return (
        <div className="board-container">
            <div className="board-header">
                <button className="write-button" onClick={() => navigate('/board/write')}>
                    새 글 작성
                </button>
                <span className="location">위치 : 게시판</span>
            </div>

            <table className="board-table">
                <thead>
                    <tr>
                        <th>문제</th>
                        <th>카테고리</th>
                        <th>제목</th>
                        <th>언어</th>
                        <th>작성자</th>
                        <th>게시 일자</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="notice-row">
                        <td></td>
                        <td>공지</td>
                        <td>
                            <span className="badge">필독</span> 게시판 이용 수칙 (2025.03.17.)
                            <span className="comment-count">[10]</span>
                        </td>
                        <td></td>
                        <td className="writer admin">admin</td>
                        <td>2024-02-17</td>
                    </tr>

                    {currentPosts.map((post) => (
                        <tr key={post.id}>
                            <td>{post.problemId || '-'}</td>
                            <td>{post.category}</td>
                            <td
                                className="clickable-title"
                                onClick={() => navigate(`/board/${post.id}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                {post.title}
                                {post.new && <span className="new">New</span>}
                                {post.commentCount > 0 && (
                                    <span className="comment-count">[{post.commentCount}]</span>
                                )}
                            </td>
                            <td>{post.language}</td>
                            <td className="writer">{post.writer}</td>
                            <td>{post.createdAt ? post.createdAt.slice(0, 10) : '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    {'«'}
                </button>
                {Array.from({ length: totalPages }, (_, idx) => (
                    <button
                        key={idx + 1}
                        className={currentPage === idx + 1 ? 'active' : ''}
                        onClick={() => handlePageChange(idx + 1)}
                    >
                        {idx + 1}
                    </button>
                ))}
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    {'»'}
                </button>
            </div>
        </div>
    );
};

export default BoardPage;
