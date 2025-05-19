package com.aicodegem.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "problems")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Problem {
    @Id
    private String id;

    @Indexed
    private String title;
    private String description;

    private List<String> inputExamples;
    private List<String> outputExamples;

    private String constraints;
    private String createdBy;

    private Integer option; // 문제 유형 추가 (0: 코드 개선용, 1: 알고리즘 로직용 2: 테스트 케이스용)

    @Indexed
    private ProblemStatus status; // 상태 (PENDING, APPROVED)

    private String rule; // 규칙 제목 필드 추가
}