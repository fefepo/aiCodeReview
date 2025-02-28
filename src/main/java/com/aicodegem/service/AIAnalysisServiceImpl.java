package com.aicodegem.service;

import com.aicodegem.model.CodeSubmission;
import com.aicodegem.repository.CodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.client.RestTemplate;
import java.io.IOException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
public class AIAnalysisServiceImpl implements AIAnalysisService {

    @Autowired
    private CodeRepository codeRepository;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public AIAnalysisServiceImpl() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    // AI 모델을 호출하여 코드 분석 점수 반환
    public int analyzeCode(String code) throws IOException {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("code", code);

        String aiModelUrl = String.format("http://192.168.34.16:8888/predict"); // AI 모델 서버 URL
        String aiResponse = restTemplate.postForObject(aiModelUrl, requestBody, String.class);

        JsonNode jsonResponse = objectMapper.readTree(aiResponse);
        return jsonResponse.path("score").asInt(); // "score" 필드에서 점수 추출
    }

    // AI 모델을 호출하여 코드에 대한 피드백 반환
    public String generateFeedback(String code) throws IOException {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("code", code);

        String aiModelUrl = "http://192.168.34.16:8888/predict";
        String aiResponse = restTemplate.postForObject(aiModelUrl, requestBody, String.class);

        JsonNode jsonResponse = objectMapper.readTree(aiResponse);
        return jsonResponse.path("feedback").asText(); // "feedback" 필드에서 피드백 추출
    }

    // AI 모델과 상호작용하여 코드를 분석하고 저장하는 메서드
    public CodeSubmission analyzeAndStoreCode(String userId, String code, String title) throws IOException {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("userID", userId);
        requestBody.put("submittedCode", code);

        String aiModelUrl = "http://192.168.34.16:8888/predict";
        String aiResponse = restTemplate.postForObject(aiModelUrl, requestBody, String.class);
        JsonNode jsonResponse = objectMapper.readTree(aiResponse);

        String feedbackContent = jsonResponse.path("feedback").asText();
        int initialScore = jsonResponse.path("score").asInt();
        LocalDate feedbackDate = LocalDate.now();

        // CodeSubmission 객체 생성 및 설정
        CodeSubmission submission = new CodeSubmission(Long.parseLong(userId), code, title);
        submission.setFeedback(feedbackContent);
        submission.setInitialScore(initialScore);
        submission.setFeedbackDate(feedbackDate);

        codeRepository.save(submission);

        return submission;
    }

    // 수정된 코드 분석 및 저장 메서드
    // public CodeSubmission analyzeAndStoreRevisedCode(String submissionId, String
    // revisedCode) throws IOException {
    // // 기존 제출 기록 조회
    // Optional<CodeSubmission> optionalSubmission =
    // codeRepository.findById(submissionId);

    // if (optionalSubmission.isEmpty()) {
    // throw new RuntimeException("제출 ID에 해당하는 기록이 없습니다.");
    // }

    // CodeSubmission submission = optionalSubmission.get();

    // // AI 분석 요청
    // Map<String, String> requestBody = new HashMap<>();
    // requestBody.put("revisedCode", revisedCode);

    // String aiModelUrl = "http://192.168.34.13:8888/repredict";
    // String aiResponse = restTemplate.postForObject(aiModelUrl, requestBody,
    // String.class);

    // // AI 응답 파싱
    // JsonNode jsonResponse = objectMapper.readTree(aiResponse);
    // String feedbackContent = jsonResponse.path("feedback").asText(); // 피드백 추출
    // int revisedScore = jsonResponse.path("score").asInt(); // 점수 추출

    // // 응답 로그 출력 (디버깅용)
    // System.out.println("AI Feedback: " + feedbackContent);
    // System.out.println("AI Score: " + revisedScore);

    // // 기존 제출 정보 업데이트
    // submission.setRevisedCode(revisedCode); // 수정된 코드 저장
    // submission.setRevisedFeedback(feedbackContent); // 수정된 피드백 저장
    // submission.setRevisedScore(revisedScore); // 수정된 점수 저장
    // submission.setFeedbackDate(LocalDate.now()); // 피드백 날짜 갱신

    // // DB 업데이트
    // return codeRepository.save(submission);
    // }

}
