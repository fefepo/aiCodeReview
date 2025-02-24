package com.aicodegem.dto;

import java.util.List;

// 문제 요청 정보를 담는 DTO 클래스
public class ProblemRequestDTO {
    private String title; // 문제 제목
    private String description; // 문제 설명
    private List<TestDTO> tests; // 테스트 정보 목록

    // Getter 메서드
    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public List<TestDTO> getTests() {
        return tests;
    }

    // Setter 메서드
    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setTests(List<TestDTO> tests) {
        this.tests = tests;
    }

    // Test 정보를 담는 DTO 클래스 (내부 static 클래스)
    public static class TestDTO {
        private String input; // 입력 값
        private String expectedOutput; // 기대하는 출력 값

        // Getter 메서드
        public String getInput() {
            return input;
        }

        public String getExpectedOutput() {
            return expectedOutput;
        }

        // Setter 메서드
        public void setInput(String input) {
            this.input = input;
        }

        public void setExpectedOutput(String expectedOutput) {
            this.expectedOutput = expectedOutput;
        }
    }
}
