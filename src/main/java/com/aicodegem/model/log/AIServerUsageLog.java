package com.aicodegem.model.log;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Table(name = "ai_server_usage_log")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AIServerUsageLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "request_id", nullable = false)
    private String requestId;

    // GPU 정보
    @Column(name = "gpu_id", nullable = false)
    private Integer gpuId;

    @Column(name = "gpu_name")
    private String gpuName;

    @Column(name = "avg_gpu_util", nullable = false)
    private Double avgGpuUtil; // 처리 중 평균 GPU 사용률(%)

    @Column(name = "max_gpu_util", nullable = false)
    private Double maxGpuUtil; // 처리 중 최대 GPU 사용률(%)

    @Column(name = "avg_gpu_memory", nullable = false)
    private Double avgGpuMemory; // 처리 중 평균 GPU 메모리 사용률(%)

    @Column(name = "max_gpu_memory", nullable = false)
    private Double maxGpuMemory; // 처리 중 최대 GPU 메모리 사용률(%)

    @Column(name = "request_type", nullable = false)
    private String requestType; // 요청 유형 (websocket, streaming)

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
