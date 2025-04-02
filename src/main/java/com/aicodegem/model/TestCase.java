package com.aicodegem.model;

import jakarta.persistence.*;

@Entity
@Table(name = "test_cases")
public class TestCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long problemId; // 문제 ID

    @Column(nullable = false, columnDefinition = "TEXT")
    private String inputData; // 입력 데이터

    @Column(nullable = false, columnDefinition = "TEXT")
    private String expectedOutput; // 예상 출력 데이터

    public TestCase() {
    }

    public TestCase(Long problemId, String inputData, String expectedOutput) {
        this.problemId = problemId;
        this.inputData = inputData;
        this.expectedOutput = expectedOutput;
    }

    public Long getId() {
        return id;
    }

    public Long getProblemId() {
        return problemId;
    }

    public void setProblemId(Long problemId) {
        this.problemId = problemId;
    }

    public String getInputData() {
        return inputData;
    }

    public void setInputData(String inputData) {
        this.inputData = inputData;
    }

    public String getExpectedOutput() {
        return expectedOutput;
    }

    public void setExpectedOutput(String expectedOutput) {
        this.expectedOutput = expectedOutput;
    }
}
