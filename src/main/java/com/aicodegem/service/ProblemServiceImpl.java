package com.aicodegem.service;

import java.util.List;
import java.util.stream.Collectors;

import org.aspectj.weaver.patterns.TypePatternQuestions.Question;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.aicodegem.dto.ProblemApprovalResponse;
import com.aicodegem.model.Problem;
import com.aicodegem.model.Problem.ProblemStatus;
import com.aicodegem.model.ProblemRequest;
import com.aicodegem.model.ProblemRequest.RequestStatus;
import com.aicodegem.repository.ProblemRepository;
import com.aicodegem.repository.ProblemRequestRepository;
import com.aicodegem.repository.RuleRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProblemServiceImpl implements ProblemService {
    private final ProblemRequestRepository requestRepository;
    private final ProblemRepository problemRepository;
    private final RuleRepository ruleRepository;

    // 문제 요청 제출 (사용자가 요청)
    public ProblemRequest submitProblemRequest(ProblemRequest request) {
        validateRules(request.getAttachedRuleIds()); // 규칙 ID가 유효한지 확인
        return requestRepository.save(request);
    }

    // 관리자 승인 처리
    public ProblemApprovalResponse approveProblemRequest(String requestId, boolean isApproved) {
        ProblemRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new IllegalStateException("이미 처리된 요청입니다");
        }

        request.setStatus(isApproved ? RequestStatus.APPROVED : RequestStatus.REJECTED);
        requestRepository.save(request);

        if (isApproved) {
            // ProblemRequest의 데이터로 Problem 생성
            Problem problem = new Problem(
                    request.getTitle(),
                    request.getDescription(),
                    request.getAttachedRuleIds()); // Rule ID만 저장
            problem = problemRepository.save(problem);
        }

        return new ProblemApprovalResponse(requestId, request.getStatus());
    }

    // 문제 상태 변경 (ACTIVE ↔ ARCHIVED)
    public void changeProblemStatus(String problemId, ProblemStatus newStatus) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new RuntimeException(problemId + ":를 찾을 수 없습니다."));

        if (problem.getStatus() == ProblemStatus.ARCHIVED) {
            throw new IllegalStateException("아카이브된 문제는 상태 변경 불가");
        }

        problem.setStatus(newStatus);
        problemRepository.save(problem);
    }

    // 규칙 유효성 검증
    private void validateRules(List<String> ruleIds) {
        ruleIds.forEach(id -> {
            if (!ruleRepository.existsById(id)) {
                throw new RuntimeException("Invalid rule ID: " + id);
            }
        });
    }

    // 전체 문제 목록 조회
    public List<Problem> getAllProblems() {
        return problemRepository.findAll();
    }

    // 단일 문제 조회
    public Problem getProblemById(String problemId) {
        return problemRepository.findById(problemId)
                .orElseThrow(() -> new RuntimeException("문제를 찾을 수 없습니다: " + problemId));
    }

    public Page<Problem> searchByTitle(String title, Pageable pageable) {
        if (title == null)
            title = "";

        Page<Problem> byTitleContaining = problemRepository.findByTitleContaining(title, pageable);
        return byTitleContaining;
    }
}
