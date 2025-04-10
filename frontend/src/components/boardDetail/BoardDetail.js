import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BoardDetail.css';
import BoardAnswer from '../answer/BoardAnswer'; // ✅ 임시 주석 처리

const BoardDetail = () => {
    const { id } = useParams(); // URL에서 게시글 ID 추출
    const [post, setPost] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`http://localhost:8080/api/board/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error('게시글 조회 실패');
                const data = await res.json();
                setPost(data);
            } catch (err) {
                console.error(err);
                alert('게시글을 불러오는 중 문제가 발생했습니다.');
            }
        };

        fetchPost();
    }, [id]);

    if (!post) return <div className="board-detail">로딩 중...</div>;

    return (
        <div className="board-detail">
            <div className="detail-header">
                <h2>{post.title}</h2>
                <div className="meta-info">
                    <span>작성자: {post.writer}</span>
                    <span> | 날짜: {post.createdAt ? post.createdAt.slice(0, 10) : '-'}</span>
                    <span> | 언어: {post.language}</span>
                </div>
            </div>

            <div className="detail-body">
                <p><strong>카테고리:</strong> {post.category}</p>
                {post.problemId && (
                    <p><strong>문제 번호:</strong> {post.problemId}</p>
                )}
                <div className="detail-content">
                    {post.content}
                </div>
            </div>

            <div className="detail-footer">
                <button onClick={() => navigate('/board')} className="back-button">목록으로</button>
            </div>

            {/* ✅ 답변 컴포넌트 임시 비활성화 */}
            {<BoardAnswer boardId={id} />}
        </div>
    );
};

export default BoardDetail;
