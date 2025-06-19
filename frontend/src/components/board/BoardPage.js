import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BoardPage.css';

const BoardPage = () => {
    // 게시글 데이터 상태 저장
    const [postData, setPostData] = useState([]);
    // 현재 페이지 상태
    const [currentPage, setCurrentPage] = useState(1);
    // 인증 여부 상태
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    const postsPerPage = 10; // 페이지당 게시글 수
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // 토큰 확인
        const token = localStorage.getItem('token');

        // 토큰이 없을 경우 인증 실패 처리 및 로그인 페이지로 리디렉션
        if (!token) {
            setIsAuthenticated(false);
            setTimeout(() => {
                navigate('/login', { state: { from: location.pathname } });
            }, 2000);
            return;
        }

        // 게시글 데이터 API 호출
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
                setPostData(data); // 게시글 데이터 저장
            } catch (err) {
                console.error(err);
            }
        };

        fetchPosts(); // 게시글 로딩 실행
    }, [location.pathname, navigate]);

    // 전체 페이지 수 계산
    const totalPages = Math.ceil(postData.length / postsPerPage);
    // 현재 페이지에서 보여줄 게시글 범위 계산
    const startIdx = (currentPage - 1) * postsPerPage;
    const currentPosts = postData.slice(startIdx, startIdx + postsPerPage);

    // 페이지 변경 핸들러
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // 인증되지 않은 사용자의 화면 처리
    if (!isAuthenticated) {
        return (
            <div className="unauthenticated">
                <h2>🔒 로그인 후 이용해 주세요.</h2>
                <p>잠시 후 로그인 페이지로 이동합니다...</p>
            </div>
        );
    }

    // 인증된 사용자의 게시판 UI 렌더링
    return (
        <div className="board-container">
            {/* 게시글 작성 버튼 및 위치 안내 */}
            <div className="board-header">
                <button className="write-button" onClick={() => navigate('/board/write')}>
                    새 글 작성
                </button>
                <span className="location">위치 : 게시판</span>
            </div>

            {/* 게시글 리스트 테이블 */}
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
                    {/* 공지사항 고정 행 */}
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

                    {/* 현재 페이지의 게시글 렌더링 */}
                    {currentPosts.map((post) => (
                        <tr key={post.id}>
                            <td>{post.problemId || '-'}</td>
                            <td>{post.category}</td>
                            <td
                                className="clickable-title"
                                onClick={() => navigate(`/board/${post.id}`)} // 게시글 상세 이동
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

            {/* 페이지네이션 UI */}
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
