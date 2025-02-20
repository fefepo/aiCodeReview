package com.aicodegem.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "problem_requests")
@Data
@NoArgsConstructor
public class ProblemRequest {
    @Id
    private String id;
    private String title; // 제목
    private String description; // 세부 사항
    private String requesterId; // 요청자
    private LocalDateTime requestDate = LocalDateTime.now();
    private RequestStatus status = RequestStatus.PENDING; // 기본 상태
    private List<String> attachedRuleIds = new ArrayList<>(); // 규칙 ["rule1", "rule2"] 형식

    public enum RequestStatus {
        PENDING, APPROVED, REJECTED
    }

    // 상태 변경 메서드
    public void approve(String reviewerId) {
        this.status = RequestStatus.APPROVED;
    }

    // 상태 변경 메서드
    public void reject(String reviewerId, String reason) {
        this.status = RequestStatus.REJECTED;
    }
}
