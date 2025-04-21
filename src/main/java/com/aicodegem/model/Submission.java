package com.aicodegem.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "submissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Submission {
    @Id
    private String id;

    private String problemId; // 🛠️ 문제 ID 필드
    private String userId;
    private String code;
    private String language;
    private String status;
    private String output;

    @Builder.Default
    private LocalDateTime submittedAt = LocalDateTime.now(); // ✅ 자동 생성 시간 기록

    public String getProblemId() {
        return problemId;
    }

    public static class SubmissionBuilder {
        private String problemId;

        public SubmissionBuilder problemId(String problemId) {
            this.problemId = problemId;
            return this;
        }
    }
}