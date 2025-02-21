package com.aicodegem.controller;

import com.aicodegem.dto.ProblemRequestDTO;
import com.aicodegem.model.Problem;
import com.aicodegem.model.ProblemRequest;
import com.aicodegem.service.ProblemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/problems")
public class ProblemController {
    private final ProblemService problemService;

    public ProblemController(ProblemService problemService) {
        this.problemService = problemService;
    }

    // 문제 요청 생성
    @PostMapping("/request")
    public ResponseEntity<ProblemRequest> requestProblem(@RequestBody ProblemRequestDTO dto) {
        return ResponseEntity.ok(problemService.saveProblemRequest(dto));
    }

    // 요청된 문제 목록 조회
    @GetMapping("/request")
    public ResponseEntity<List<ProblemRequest>> getAllProblemRequests() {
        return ResponseEntity.ok(problemService.getAllProblemRequests());
    }

    // 문제 요청 승인
    @PutMapping("/request/{id}/approve")
    public ResponseEntity<Problem> approveProblemRequest(@PathVariable Long id) {
        Optional<Problem> problem = problemService.approveProblemRequest(id);
        return problem.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 문제 요청 거절
    @PutMapping("/request/{id}/reject")
    public ResponseEntity<Void> rejectProblemRequest(@PathVariable Long id) {
        return problemService.rejectProblemRequest(id) ? ResponseEntity.ok().build()
                : ResponseEntity.notFound().build();
    }

    // 승인된 문제 목록 조회
    @GetMapping
    public ResponseEntity<List<Problem>> getAllApprovedProblems() {
        return ResponseEntity.ok(problemService.getAllApprovedProblems());
    }

    // 승인된 문제 검색
    @GetMapping("/search")
    public ResponseEntity<List<Problem>> searchProblems(@RequestParam String query) {
        List<Problem> problems = problemService.searchProblems(query);
        return ResponseEntity.ok(problems);
    }
}
