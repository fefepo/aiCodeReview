package com.aicodegem.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "rules")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Rule {
    @Id
    private String id; // 규칙 번호

    private String title; // 제목
    private String description; // 상세 정보
    private RuleStatus status; // 상태 필드
}
