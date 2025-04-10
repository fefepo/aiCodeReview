package com.aicodegem.controller;

import com.aicodegem.dto.ProblemRequestDto;
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
    public ResponseEntity<Problem> createProblem(@RequestBody ProblemRequestDto dto) {
        Problem problem = problemService.createProblem(dto);
        return ResponseEntity.ok(problem);
    }

    // ✅ 모든 문제 조회 API
    @GetMapping
    public ResponseEntity<List<Problem>> getAllProblems() {
        List<Problem> problems = problemService.getAllProblems();
        return ResponseEntity.ok(problems);
    }

    // ✅ 특정 문제 조회 API
    @GetMapping("/{id}")
    public ResponseEntity<Problem> getProblemById(@PathVariable Long id) {
        return problemService.getProblemById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ✅ 문제 수정 API
    @PutMapping("/{id}")
    public ResponseEntity<Problem> updateProblem(@PathVariable Long id, @RequestBody ProblemRequestDto dto) {
        Optional<Problem> updated = problemService.updateProblem(id, dto);
        return updated.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ✅ 문제 삭제 API
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProblem(@PathVariable Long id) {
        if (problemService.deleteProblem(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
