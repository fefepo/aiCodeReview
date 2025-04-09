import React, { useState } from 'react';
import './StatusPage.css';

const dummyData = [
    {
        id: 42236093,
        username: 'mimiminji04',
        problemId: 1898,
        result: '정확한 풀이',
        memory: 14316,
        time: 18,
        language: 'Python',
        codeSize: 14,
        submittedAt: '방금',
    },
    {
        id: 42236092,
        username: 'ksh090824',
        problemId: 2343,
        result: '잘못된 풀이',
        memory: 14316,
        time: 18,
        language: 'Python',
        codeSize: 35,
        submittedAt: '방금',
    },
    {
        id: 42236091,
        username: 'sunnypython',
        problemId: 1555,
        result: '컴파일 에러',
        memory: 0,
        time: 0,
        language: 'Java',
        codeSize: 54,
        submittedAt: '5분 전',
    },
    {
        id: 42236090,
        username: 'jscode',
        problemId: 4343,
        result: '정확한 풀이',
        memory: 12000,
        time: 12,
        language: 'JavaScript',
        codeSize: 22,
        submittedAt: '10분 전',
    },
    {
        id: 42236089,
        username: 'kimdev',
        problemId: 6050,
        result: '잘못된 풀이',
        memory: 13200,
        time: 20,
        language: 'Python',
        codeSize: 30,
        submittedAt: '15분 전',
    },
    {
        id: 42236088,
        username: 'heejin',
        problemId: 6545,
        result: '컴파일 에러',
        memory: 0,
        time: 0,
        language: 'C++',
        codeSize: 40,
        submittedAt: '20분 전',
    },
    {
        id: 42236087,
        username: 'younghoon',
        problemId: 2491,
        result: '정확한 풀이',
        memory: 14000,
        time: 11,
        language: 'Python',
        codeSize: 25,
        submittedAt: '25분 전',
    },
    {
        id: 42236086,
        username: 'minjun',
        problemId: 3341,
        result: '정확한 풀이',
        memory: 13800,
        time: 13,
        language: 'C',
        codeSize: 32,
        submittedAt: '30분 전',
    },
    {
        id: 42236085,
        username: 'devdo',
        problemId: 1930,
        result: '잘못된 풀이',
        memory: 14400,
        time: 17,
        language: 'Python',
        codeSize: 28,
        submittedAt: '40분 전',
    },
    {
        id: 42236084,
        username: 'sunnygirl',
        problemId: 3104,
        result: '정확한 풀이',
        memory: 13900,
        time: 16,
        language: 'Java',
        codeSize: 20,
        submittedAt: '50분 전',
    },
    // 👇 아래는 2페이지 데이터 (3개)
    {
        id: 42236083,
        username: 'leeminho',
        problemId: 5102,
        result: '정확한 풀이',
        memory: 13000,
        time: 10,
        language: 'Python',
        codeSize: 24,
        submittedAt: '1시간 전',
    },
    {
        id: 42236082,
        username: 'choijh',
        problemId: 6104,
        result: '잘못된 풀이',
        memory: 13100,
        time: 15,
        language: 'JavaScript',
        codeSize: 27,
        submittedAt: '1시간 전',
    },
    {
        id: 42236081,
        username: 'hanji',
        problemId: 6431,
        result: '컴파일 에러',
        memory: 0,
        time: 0,
        language: 'Java',
        codeSize: 19,
        submittedAt: '2시간 전',
    },
];

const resultClass = {
    '정확한 풀이': 'result-accepted',
    '잘못된 풀이': 'result-wrong',
    '컴파일 에러': 'result-error',
};

const StatusPage = () => {
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(dummyData.length / itemsPerPage);
    const currentData = dummyData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <div className="statusPage-wrapper">
            <h1 className="statusPage-title">코드 채점 기록</h1>
            <table className="statusPage-table">
                <thead>
                    <tr>
                        <th>제출 번호</th>
                        <th>사용자</th>
                        <th>문제 번호</th>
                        <th>결과</th>
                        <th>사용 언어</th>
                        <th>코드 길이</th>
                        <th>제출 시간</th>
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((submission) => (
                        <tr key={submission.id}>
                            <td>{submission.id}</td>
                            <td className="statusPage-username">{submission.username}</td>
                            <td className="statusPage-problem-link">{submission.problemId}</td>
                            <td>
                                <span className={`statusPage-result-tag ${resultClass[submission.result]}`}>
                                    {submission.result}
                                </span>
                            </td>
                            <td>{submission.language}</td>
                            <td>{submission.codeSize} B</td>
                            <td>{submission.submittedAt}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="statusPage-pagination">
                <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
                    {'«'}
                </button>
                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => setPage(i + 1)}
                        className={page === i + 1 ? 'statusPage-active-page' : ''}
                    >
                        {i + 1}
                    </button>
                ))}
                <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
                    {'»'}
                </button>
            </div>
        </div>
    );
};

export default StatusPage;
