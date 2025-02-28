package com.aicodegem.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "rules")
@Data
@NoArgsConstructor
public class Rule {
    @Id
    private String id; // MongoDB에서 자동 생성되는 ObjectId
    private String name; // 규칙 이름
    private String description; // 규칙 설명
    private String category; // 규칙 카테고리 (예: "Naming")
    private boolean isAICheck; // AI 검증 필요 여부
    private String validationPrompt; // AI 검증 프롬프트 템플릿

    public Rule(String name, String description, String category, boolean isAICheck, String validationPrompt) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.isAICheck = isAICheck;
        this.validationPrompt = validationPrompt;
    }
}