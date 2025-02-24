package com.aicodegem.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
public class ProblemTest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String input;
    private String expectedOutput;

    @ManyToOne
    @JoinColumn(name = "problem_request_id")
    @JsonBackReference // 부모 객체로의 역참조는 직렬화하지 않음
    private ProblemRequest problemRequest;

    // Getter 및 Setter
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getInput() {
        return input;
    }

    public void setInput(String input) {
        this.input = input;
    }

    public String getExpectedOutput() {
        return expectedOutput;
    }

    public void setExpectedOutput(String expectedOutput) {
        this.expectedOutput = expectedOutput;
    }

    public ProblemRequest getProblemRequest() {
        return problemRequest;
    }

    public void setProblemRequest(ProblemRequest problemRequest) {
        this.problemRequest = problemRequest;
    }
}
