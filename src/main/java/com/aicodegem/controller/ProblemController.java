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
    public Problem createProblem(@RequestBody ProblemRequestDto problemRequestDto) {
        return problemService.createProblem(problemRequestDto);
    }

    // ✅ 모든 문제 조회 API
    @GetMapping
    public List<Problem> getAllProblems() {
        return problemService.getAllProblems();
    }

    // ✅ 특정 문제 조회 API
    @GetMapping("/{id}")
    public Optional<Problem> getProblemById(@PathVariable Long id) {
        return problemService.getProblemById(id);
    }

    // ✅ 문제 수정 API
    @PutMapping("/{id}")
    public ResponseEntity<Problem> updateProblem(@PathVariable Long id, @RequestBody Problem updatedProblem) {
        Optional<Problem> updated = problemService.updateProblem(id, updatedProblem);
        return updated.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build()); // 문제 없으면 404 반환
    }

    // ✅ 문제 삭제 API
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProblem(@PathVariable Long id) {
        if (problemService.deleteProblem(id)) {
            return ResponseEntity.noContent().build(); // 성공 시 204 응답
        } else {
            return ResponseEntity.notFound().build(); // 문제 없으면 404 응답
        }
    }
}
