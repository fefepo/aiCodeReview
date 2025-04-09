package com.aicodegem.controller;

import com.aicodegem.model.CodeSubmission;
import com.aicodegem.service.CodeSubmissionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/code")
public class CodeAnalysisController {

    // Logger 생성
    private static final Logger logger = LoggerFactory.getLogger(CodeAnalysisController.class);

    @Autowired
    private CodeSubmissionService codeSubmissionService;

    private static final String AI_SERVER_URL = "http://192.168.34.16:8888/predict"; // AI 서버 URL

    @PostMapping("/submit")
    public ResponseEntity<CodeSubmission> submitCode(@RequestParam Long userId, @RequestParam String code,
            @RequestParam String title) { // 가지고 있는 param: userId, code, title
        try { // 코드 제출
            CodeSubmission submission = codeSubmissionService.submitCode(userId, code, title);
            logger.info("사용자 {}의 코드 제출 완료. 제출 ID: {}", userId, submission.getId());
            return ResponseEntity.ok(submission);
        } catch (IOException | InterruptedException e) { // 예외처리(pylint가 동작 안할 경우 500 서버에러 출력)
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping("/revise")
    public ResponseEntity<CodeSubmission> reviseCode(@RequestParam String submissionId,
            @RequestParam String revisedCode) { // 가지고 있는 param: submissionId, revisedCode
        try { // 코드 수정 후 제출
            CodeSubmission submission = codeSubmissionService.reviseCode(submissionId, revisedCode);
            logger.info("제출 ID {}의 코드 수정 완료", submissionId);
            return ResponseEntity.ok(submission);
        } catch (IOException | InterruptedException e) { // 예외처리(pylint가 동작 안할 경우 500 서버에러 출력)
            return ResponseEntity.status(500).body(null);
        }
    }

    // 사용자 제출물 조회 API
    @GetMapping("/submissions")
    public ResponseEntity<List<CodeSubmission>> getUserSubmissions(@RequestParam Long userId) {
        // db로 부터 사용자로 부터 저장된 제출코드및 점수목록 list형태로 가져오기
        List<CodeSubmission> submissions = codeSubmissionService.getUserSubmissions(userId);

        if (submissions.isEmpty()) { // 사용자가 제출한 코드가 없을 경우
            return ResponseEntity.noContent().build();
        }

        logger.info("사용자 {}의 제출물 조회 완료. 제출물 개수: {}", userId, submissions.size());
        return ResponseEntity.ok(submissions);
    }

    // AI 피드백 제공 API
    @PostMapping("/feedback")
    public ResponseEntity<?> getAiFeedback(@RequestBody Map<String, Object> payload) {
        try {
            // AI 컨테이너 서버와 통신
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<Map> aiResponse = restTemplate.postForEntity(AI_SERVER_URL, payload, Map.class);

            // AI 서버의 응답 반환
            return ResponseEntity.ok(aiResponse.getBody());
        } catch (Exception e) {
            // 오류 처리
            return ResponseEntity.status(500).body("AI 피드백 요청 처리 중 오류 발생: " + e.getMessage());
        }
    }
}
