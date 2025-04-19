package com.aicodegem.service;

import com.aicodegem.model.CodeSubmission;
import com.aicodegem.repository.CodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AIAnalysisServiceImpl implements AIAnalysisService {

    @Autowired
    private CodeRepository codeRepository;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${server.aicode.feedback.host}")
    private String host;

    @Value("${server.aicode.feedback.port}")
    private String port;

    public AIAnalysisServiceImpl() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    String aiModelUrl = String.format("http://%s:%s/predict", host, port); // AI 모델 서버 URL

    // AI 모델을 호출하여 코드 분석 점수 반환
    public int analyzeCode(String code) throws IOException {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("code", code);

        String aiResponse = restTemplate.postForObject(aiModelUrl, requestBody, String.class);

        JsonNode jsonResponse = objectMapper.readTree(aiResponse);
        return jsonResponse.path("score").asInt(); // "score" 필드에서 점수 추출
    }

    // AI 모델을 호출하여 코드에 대한 피드백 반환
    public String generateFeedback(String code) throws IOException {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("code", code);

        String aiResponse = restTemplate.postForObject(aiModelUrl, requestBody, String.class);

        JsonNode jsonResponse = objectMapper.readTree(aiResponse);
        return jsonResponse.path("feedback").asText(); // "feedback" 필드에서 피드백 추출
    }

    // AI 모델과 상호작용하여 코드를 분석하고 저장하는 메서드
    public CodeSubmission analyzeAndStoreCode(String userId, String code, String title) throws IOException {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("userID", userId);
        requestBody.put("submittedCode", code);

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

}