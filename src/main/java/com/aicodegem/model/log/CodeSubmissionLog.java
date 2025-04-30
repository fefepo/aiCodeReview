package com.aicodegem.model.log;

import java.time.LocalDateTime;

import com.aicodegem.model.User;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CodeSubmissionLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "submission_id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // 사용자 아이디

    @Column(name = "language", nullable = false, length = 20)
    private String language; // 코드 언어

    @Column(name = "status", nullable = false)
    private String status; // 문제 상태(잘못된 풀이인지, 정답인지)

    @Column(name = "submission_time")
    private LocalDateTime submissionTime; // 제출 시간

    @Column(name = "exec_time_ms")
    private Integer execTimeMs; // 코드 실행 시간

    @Column(name = "memory_usage_kb")
    private Integer memoryUsageKb;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;
}
