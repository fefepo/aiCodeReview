package com.aicodegem.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "rule_requests")
@Data
@NoArgsConstructor
public class RuleRequest {
    @Id
    private String id;
    private String name; // 규칙 이름
    private String description; // 규칙 설명
    private String category; // 규칙 카테고리
    private boolean aiCheck; // AI 검증 필요 여부
    private String validationPrompt; // AI 검증 프롬프트 템플릿
    private LocalDateTime requestDate = LocalDateTime.now(); // 요청 날짜
    private RequestStatus status = RequestStatus.PENDING; // 요청 상태

    public enum RequestStatus {
        PENDING, APPROVED, REJECTED
    }

    public void approve() {
        this.status = RequestStatus.APPROVED;
    }

    public void reject() {
        this.status = RequestStatus.REJECTED;
    }
}