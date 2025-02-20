package com.aicodegem.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "problem_requests")
@Data
@NoArgsConstructor
public class ProblemRequest {
    @Id
    private String id;
    private String title;
    private String description;
    private String requesterId;
    private LocalDateTime requestDate = LocalDateTime.now();
    private RequestStatus status = RequestStatus.PENDING;
    private List<String> attachedRuleIds = new ArrayList<>();

    public enum RequestStatus {
        PENDING, APPROVED, REJECTED
    }

    // 상태 변경 메서드
    public void approve(String reviewerId) {
        this.status = RequestStatus.APPROVED;
    }

    public void reject(String reviewerId, String reason) {
        this.status = RequestStatus.REJECTED;
    }
}
