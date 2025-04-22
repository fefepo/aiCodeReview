package com.aicodegem.model.log;

import java.math.BigDecimal;
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

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "cpu_usage_percent", nullable = false, precision = 5, scale = 2)
    private BigDecimal cpuUsagePercent;

    @Column(name = "memory_usage_mb", nullable = false, precision = 7, scale = 2)
    private BigDecimal memoryUsageMb;

    @Column(name = "gpu_usage_percent", precision = 5, scale = 2)
    private BigDecimal gpuUsagePercent;

    @Column(name = "active_sessions", nullable = false)
    private Integer activeSessions;
}
