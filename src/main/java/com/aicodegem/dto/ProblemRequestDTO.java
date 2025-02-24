package com.aicodegem.dto;

// 문제 요청 정보를 담는 DTO 클래스
public class ProblemRequestDTO {
    private String title; // 문제 제목
    private String description; // 문제 설명

    // Getter 메서드
    public String getTitle() {
        return title; // 제목 반환
    }

    public String getDescription() {
        return description; // 설명 반환
    }

    // Setter 메서드
    public void setTitle(String title) {
        this.title = title; // 제목 설정
    }

    public void setDescription(String description) {
        this.description = description; // 설명 설정
    }
}
