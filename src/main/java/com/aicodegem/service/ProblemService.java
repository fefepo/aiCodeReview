package com.aicodegem.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.aicodegem.dto.ProblemApprovalResponse;
import com.aicodegem.model.Problem;
import com.aicodegem.model.Problem.ProblemStatus;
import com.aicodegem.model.ProblemRequest;

public interface ProblemService {
    ProblemRequest submitProblemRequest(ProblemRequest request); // 문제 추가 요청

    ProblemApprovalResponse approveProblemRequest(String requestId, boolean isApproved); // 관리자 문제 승인

    void changeProblemStatus(String problemId, ProblemStatus newStatus); // 문제 상태 변경

    List<Problem> getAllProblems(); // 전체 문제 조회

    Problem getProblemById(String problemId); // 단일 문제 조회

    Page<Problem> searchByTitle(String title, Pageable pageable); // 문제 검색
}
