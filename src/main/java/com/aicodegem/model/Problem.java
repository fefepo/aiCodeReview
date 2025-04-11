package com.aicodegem.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Problem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    @ElementCollection
    private List<String> inputExamples;

    @ElementCollection
    private List<String> outputExamples;

    private String constraints;
    private String createdBy;

    @Enumerated(EnumType.STRING)
    private ProblemStatus status; // 🔹 상태 추가 (PENDING, APPROVED)
}
