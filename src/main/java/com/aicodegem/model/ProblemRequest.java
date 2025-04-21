package com.aicodegem.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "problem_requests")
@Getter
@Setter
public class ProblemRequest {
    @Id
    private String id;

    @Indexed
    private String title;
    private String content;
    private String answer;

    private Status status = Status.PENDING;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum Status {
        PENDING, APPROVED, REJECTED
    }
}

// 현우형 이거 필요 없는거지?