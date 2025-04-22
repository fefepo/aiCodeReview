package com.aicodegem.model.log;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import com.aicodegem.model.User;

@Table(name = "ai_response_time_log")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AIResponseTimeLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user; // 요청한 사용자

    @Column(name = "request_time", nullable = false)
    private LocalDateTime requestTime; // 요청시간

    @Column(name = "response_time", nullable = false)
    private LocalDateTime responseTime; // 응답 시간

    @Column(name = "processing_time_ms", nullable = false)
    private Integer processingTimeMs; // 처리시간

    @Column(name = "request_type", length = 50)
    private String requestType; // rest_api인지 websocket으로 요청이 들어왔는지
}
