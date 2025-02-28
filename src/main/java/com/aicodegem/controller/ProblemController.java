package com.aicodegem.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.aicodegem.dto.MultiResponseDto;
import com.aicodegem.dto.ProblemApprovalResponse;
import com.aicodegem.dto.ProblemResponseDto;
import com.aicodegem.model.Problem.ProblemStatus;
import com.aicodegem.model.ProblemRequest;
import com.aicodegem.service.ProblemService;
import com.aicodegem.model.Problem;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/problems")
@RequiredArgsConstructor
public class ProblemController {
    private final ProblemService problemService;

    // 전체 문제 목록 조회
    @GetMapping
    public ResponseEntity<List<Problem>> getAllProblems() {
        List<Problem> problems = problemService.getAllProblems();
        return ResponseEntity.ok(problems);
    }

    // 단일 문제 조회 (problemId 기준)
    @GetMapping("/{problemId}")
    public ResponseEntity<Problem> getProblemById(@PathVariable String problemId) {
        Problem problem = problemService.getProblemById(problemId);
        return ResponseEntity.ok(problem);
    }

    // 문제 요청 제출 (사용자가 요청)
    @PostMapping("/request")
    public ResponseEntity<ProblemRequest> submitProblemRequest(@RequestBody ProblemRequest request) {
        ProblemRequest savedRequest = problemService.submitProblemRequest(request);
        return ResponseEntity.ok(savedRequest);
    }

    // 관리자 승인 처리
    @PostMapping("/approve/{requestId}")
    public ResponseEntity<ProblemApprovalResponse> approveProblemRequest(
            @PathVariable String requestId,
            @RequestParam boolean isApproved) {
        ProblemApprovalResponse response = problemService.approveProblemRequest(requestId, isApproved);
        return ResponseEntity.ok(response);
    }

    // 문제 상태 변경 (ACTIVE -> ARCHIVED)
    @PostMapping("/{problemId}/status")
    public ResponseEntity<Void> changeProblemStatus(
            @PathVariable String problemId,
            @RequestParam ProblemStatus newStatus) {
        problemService.changeProblemStatus(problemId, newStatus);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<MultiResponseDto> searchTitle(
            @RequestParam(value = "title", required = false) String title,
            @RequestParam int page,
            @RequestParam int size) {

        // 페이지 처리된 문제 가져오기
        Page<Problem> pageProblems = problemService.searchByTitle(title, PageRequest.of(page - 1, size));

        // 엔티티를 DTO 리스트로 변환
        List<ProblemResponseDto> problems = ProblemResponseDto.fromEntityList(pageProblems.getContent());

        // 반환
        MultiResponseDto responseDto = new MultiResponseDto(problems, pageProblems);
        return ResponseEntity.ok(responseDto);
    }

}
