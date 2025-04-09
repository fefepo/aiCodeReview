package com.aicodegem.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "problems")
@Data
@NoArgsConstructor
public class Problem {
    @Id
    private String id;
    private String title; // 문제 제목
    private String description; // 세부사항
    private List<String> attachedRuleIds = new ArrayList<>(); // 규칙 ["rule1", "rule2"] 형식
    private ProblemStatus status = ProblemStatus.ACTIVE; // 기본 상태
    private LocalDateTime modifiedAt = LocalDateTime.now();

    public Problem(String title, String description, List<String> attachedRuleIds) {
        this.title = title;
        this.description = description;
        this.attachedRuleIds = attachedRuleIds;
    }

    public enum ProblemStatus {
        UNDER_REVIEW, // 검토 중
        ACTIVE, // 활성화 (사용 가능)
        INACTIVE, // 비활성화
        ARCHIVED // 아카이브됨
    } // ss
}
