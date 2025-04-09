package com.aicodegem.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Submission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long problemId; // 🛠️ 문제 ID 필드 추가
    private String userId;
    private String code;
    private String language;
    private String status;
    private String output;

    @CreationTimestamp // ✅ 자동 생성 시간 기록
    private LocalDateTime submittedAt;

    public Long getProblemId() {
        return problemId;
    }

    public static class SubmissionBuilder {
        private Long problemId;

        public SubmissionBuilder problemId(Long problemId) {
            this.problemId = problemId;
            return this;
        }
    }
}
