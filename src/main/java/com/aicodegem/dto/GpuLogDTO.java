package com.aicodegem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.aicodegem.model.log.AIServerUsageLog;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class GpuLogDTO {
        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class GpuLogResponse {
                private Long id;
                private String requestId;
                private Integer gpuId;
                private String gpuName;
                private Double avgGpuUtil;
                private Double maxGpuUtil;
                private Double avgGpuMemory;
                private Double maxGpuMemory;
                private String requestType;
                private LocalDateTime createdAt;

                public static GpuLogResponse from(AIServerUsageLog log) {
                        return GpuLogResponse.builder()
                                        .id(log.getId())
                                        .requestId(log.getRequestId())
                                        .gpuId(log.getGpuId())
                                        .gpuName(log.getGpuName())
                                        .avgGpuUtil(log.getAvgGpuUtil())
                                        .maxGpuUtil(log.getMaxGpuUtil())
                                        .avgGpuMemory(log.getAvgGpuMemory())
                                        .maxGpuMemory(log.getMaxGpuMemory())
                                        .requestType(log.getRequestType())
                                        .createdAt(log.getCreatedAt())
                                        .build();
                }

                public static List<GpuLogResponse> fromList(List<AIServerUsageLog> logs) {
                        return logs.stream()
                                        .map(GpuLogResponse::from)
                                        .collect(Collectors.toList());
                }
        }

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class GpuStatsResponse {
                private Double avgWebsocketGpuUtil;
                private Double avgStreamingGpuUtil;
                private Double maxGpuUtil;
                private Long totalLogs;
        }

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class GpuTrendResponse {
                private List<String> timeLabels;
                private List<Double> avgGpuUtils;
                private List<Double> maxGpuUtils;
        }

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class GpuCardData {
                private Integer gpuId;
                private String gpuName;
                private List<GpuLogResponse> recentLogs;
        }
}
