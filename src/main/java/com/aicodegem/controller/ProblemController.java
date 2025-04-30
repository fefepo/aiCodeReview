package com.aicodegem.controller;

import com.aicodegem.dto.ProblemRequestDTO;
import com.aicodegem.model.Problem;
import com.aicodegem.service.ProblemService;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/problems")
@RequiredArgsConstructor
public class ProblemController {
    private final ProblemService problemService;

    // ✅ 문제 생성 API
    @PostMapping
    public ResponseEntity<Problem> createProblem(@RequestBody ProblemRequestDTO dto) {
        Problem problem = problemService.createProblem(dto);
        return ResponseEntity.ok(problem);
    }

    // ✅ 모든 문제 조회 API
    @GetMapping("/admin")
    public ResponseEntity<List<Problem>> getAllProblemsForAdmin() {
        List<Problem> allProblems = problemService.getAllProblems();
        return ResponseEntity.ok(allProblems);
    }

    // ✅ 승인된 문제 조회 API
    @GetMapping
    public ResponseEntity<List<Problem>> getAllApprovedProblems() {
        List<Problem> approvedProblems = problemService.getApprovedProblems();
        return ResponseEntity.ok(approvedProblems);
    }

    // ✅ 특정 문제 조회 API
    @GetMapping("/{id}")
    public ResponseEntity<Problem> getProblemById(@PathVariable String id) {
        return problemService.getProblemById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ✅ 문제 수정 API
    @PutMapping("/{id}")
    public ResponseEntity<Problem> updateProblem(@PathVariable String id, @RequestBody ProblemRequestDTO dto) {
        Optional<Problem> updated = problemService.updateProblem(id, dto);
        return updated.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ✅ 문제 삭제 API
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProblem(@PathVariable String id) {
        if (problemService.deleteProblem(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 문제 승인 API
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveProblem(@PathVariable String id) {
        return problemService.approveProblem(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 문제 거절 API
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectProblem(@PathVariable String id) {
        return problemService.rejectProblem(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

}
