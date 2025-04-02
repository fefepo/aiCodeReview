package com.aicodegem.controller;

import com.aicodegem.dto.SubmitResponseDTO;
import com.aicodegem.model.Submission;
import com.aicodegem.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/submissions")
@RequiredArgsConstructor
public class SubmissionController {
    private final SubmissionService submissionService;

    // ✅ 코드 제출 API
    @PostMapping
    public ResponseEntity<Submission> submitCode(@RequestBody Map<String, Object> request) {
        Long problemId = Long.valueOf(request.get("problemId").toString());
        String userId = request.get("userId").toString();
        String code = request.get("code").toString();
        String language = request.get("language").toString();

        Optional<Submission> submission = submissionService.submitCode(problemId, userId, code, language);
        return submission.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.badRequest().build());
    }

    // ✅ 제출된 코드 실행 API
    @PostMapping("/{id}/execute")
    public ResponseEntity<String> executeSubmission(@PathVariable Long id) {
        SubmitResponseDTO result = submissionService.executeSubmission(id);
        return ResponseEntity.ok(result.getMessage());
    }
}
