package com.aicodegem.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDateTime;

@Entity // JPA 엔터티 클래스 선언
public class ProblemRequest {
    @Id // 기본 키 설정
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 자동 증가 전략 적용
    private Long id; // 문제 요청의 고유 ID

    private String title; // 문제 제목
    private String description; // 문제 설명

    @Enumerated(EnumType.STRING) // Enum을 문자열 형태로 저장
    private Status status = Status.PENDING; // 문제 요청 상태 (기본값: PENDING)

    private LocalDateTime createdAt = LocalDateTime.now(); // 생성 시간 (기본값: 현재 시간)

    // Getter 및 Setter

    public Long getId() {
        return id; // ID 반환
    }

    public void setId(Long id) {
        this.id = id; // ID 설정
    }

    public String getTitle() {
        return title; // 제목 반환
    }

    public void setTitle(String title) {
        this.title = title; // 제목 설정
    }

    public String getDescription() {
        return description; // 설명 반환
    }

    public void setDescription(String description) {
        this.description = description; // 설명 설정
    }

    public Status getStatus() {
        return status; // 상태 반환
    }

    public void setStatus(Status status) {
        this.status = status; // 상태 설정
    }

    public LocalDateTime getCreatedAt() {
        return createdAt; // 생성 시간 반환
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt; // 생성 시간 설정
    }
}
