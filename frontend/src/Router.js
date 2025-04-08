import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './components/user/SignUp'
import Login from './components/user/Login';
import ProfileEdit from './components/user/ProfileEdit';
import MainPage from './components/mainPage/MainPage';
import RankingPage from './components/ranking/RankingPage';
import AchievementPage from './components/achievement/AchievementPage';
import SubmittedCodes from './components/codeModify/SubmittedCodes';
import SubmitCodePage from './components/codeSubmit/SubmitCodePage';
import ProblemListPage from './components/lists/ProblemListPage';
import MakeProblem from './components/make/MakeProblem';
import BoardPage from './components/board/BoardPage';
import BoardWrite from './components/boardWrite/BoardWrite';


const AppRouter = () => {
  const [submittedCodes, setSubmittedCodes] = useState([]);

  return (
    <Router>
      <Routes>
        {/* 회원가입 페이지 경로 */}
        <Route path="/signup" element={<SignUp />} />
        {/* 로그인 페이지 경로 */}
        <Route path="/login" element={<Login />} />

        {/* 메인 페이지 경로 */}
        <Route path="/main" element={<MainPage />} />

        {/* 랭킹 페이지 경로 */}
        <Route path="/ranking" element={<RankingPage />} />

        {/* 업적 페이지 경로 */}
        <Route path="/achievement" element={<AchievementPage />} />

        {/* 코드 제출 페이지 경로 */}
        <Route path="/submission" element={<SubmitCodePage />} />

        {/* 문제 목록 페이지 경로 */}
        <Route path="/problems" element={<ProblemListPage />} />

        {/* 문제 생성 페이지 경로 */}
        <Route path="/make-problem" element={<MakeProblem />} />

        {/* 제출 코드 목록 페이지 경로 */}
        <Route path="/submitted-codes" element={<SubmittedCodes submittedCodes={submittedCodes} />} />

        {/* 개인정보 수정 페이지 경로 */}
        <Route path="/profile-edit" element={<ProfileEdit />} />

        {/* 게시판 페이지 경로 */}
        <Route path="/board" element={<BoardPage />} />

        {/* 게시판 글쓰기 페이지 경로 */}
        <Route path="/board/write" element={<BoardWrite />} />

        {/* 기본 루트 경로를 메인 페이지로 설정 */}
        <Route path="/" element={<MainPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
