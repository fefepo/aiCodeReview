package com.aicodegem.service;

import java.util.List;

import com.aicodegem.dto.ProblemApprovalResponse;
import com.aicodegem.model.Problem;
import com.aicodegem.model.Problem.ProblemStatus;
import com.aicodegem.model.ProblemRequest;

public interface ProblemService {
    ProblemRequest submitProblemRequest(ProblemRequest request);

    ProblemApprovalResponse approveProblemRequest(String requestId, boolean isApproved);

    void changeProblemStatus(String problemId, ProblemStatus newStatus);

    List<Problem> getAllProblems(); // 전체 문제 조회

    Problem getProblemById(String problemId); // 단일 문제 조회

}
