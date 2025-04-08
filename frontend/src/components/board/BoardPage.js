import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 새 글 작성 페이지로 이동을 위한 훅
import './BoardPage.css';

const categories = ['질문', '자유', '오타,오류'];

const postData = [
    { id: 8741, title: '왜 0이 나올까요?', writer: 'mincoding', date: '2025-04-05', language: 'C', category: '질문', new: true },
    { id: 2309, title: '예제는 되는데 제출하면 틀려요', writer: 'jhs0213', date: '2025-04-04', language: 'Python', commentCount: 1, category: '오타,오류' },
    { id: 7620, title: '시간 초과 어떻게 줄이죠?', writer: 'yeonhoya', date: '2025-04-03', language: 'Java', category: '질문' },
    { id: 1183, title: 'while문 쓰면 안되나요?', writer: 'shsh112', date: '2025-03-30', language: 'C', category: '자유' },
    { id: 4015, title: '초보인데 이해가 안 돼요', writer: 'junicode', date: '2025-03-30', language: 'Python', commentCount: 1, category: '질문' },
    { id: 9090, title: '배열 인덱스 에러 도와주세요', writer: 'bigduck', date: '2025-03-30', language: 'C', category: '오타,오류' },
    { id: 1472, title: '계속 런타임 오류가 떠요ㅠ', writer: 'ttya0102', date: '2025-03-29', language: 'Java', category: '질문' },
    { id: 5388, title: '파이썬 if문 조건식이 이상해요', writer: 'codeman33', date: '2025-03-29', language: 'Python', category: '오타,오류' },
    { id: 6642, title: '반례가 뭔가요?', writer: 'dani1107', date: '2025-03-26', language: 'C', category: '질문' },
    { id: 3890, title: '이렇게 풀면 안 되나요?', writer: 'tomato98', date: '2025-03-23', language: 'C', commentCount: 1, category: '자유' },
    { id: 2107, title: '채점 시스템이랑 다르게 나와요', writer: 'yuna_dev', date: '2025-03-21', language: 'Java', commentCount: 2, category: '질문' }
];

const postsPerPage = 10;

const BoardPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const totalPages = Math.ceil(postData.length / postsPerPage);
    const startIdx = (currentPage - 1) * postsPerPage;
    const currentPosts = postData.slice(startIdx, startIdx + postsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

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
                    {/* 공지글 */}
                    <tr className="notice-row">
                        <td></td>
                        <td>공지</td>
                        <td>
                            <span className="badge">필독</span> 게시판 이용 수칙 (2025.03.17.){' '}
                            <span className="comment-count">[10]</span>
                        </td>
                        <td></td>
                        <td className="writer admin">admin</td>
                        <td>2024-02-17</td>
                    </tr>

                    {/* 일반 게시글 리스트 */}
                    {currentPosts.map((post) => (
                        <tr key={post.id}>
                            <td>{post.id}</td>
                            <td>{post.category}</td>
                            <td>
                                {post.title}{' '}
                                {post.new && <span className="new">New</span>}
                                {post.commentCount && <span className="comment-count">[{post.commentCount}]</span>}
                            </td>
                            <td>{post.language}</td>
                            <td className="writer">{post.writer}</td>
                            <td>{post.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 페이징 */}
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