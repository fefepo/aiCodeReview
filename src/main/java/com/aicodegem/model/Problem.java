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
    private List<String> inputExamples; // 여러 개의 입력 예제

    @ElementCollection
    private List<String> outputExamples; // 여러 개의 출력 예제

    private String constraints;
}
