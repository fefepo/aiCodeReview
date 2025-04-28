package com.aicodegem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

public class AdminDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TimeSeriesData {
        private List<String> timeLabels;
        private List<Double> avgProcessingTimes;
        private List<Double> maxProcessingTimes;
        private List<Double> minProcessingTimes;
        private List<Long> counts;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonitoringData {
        private String timestamp;
        private Double gpuUsage;
        private Double responseTime;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdminDashboardData {
        private TimeSeriesData timeSeriesData;
        private List<MonitoringData> recentData;
        private StatsData stats;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatsData {
        private Double avgResponseTime;
        private Double maxResponseTime;
        private Double minResponseTime;
        private Long totalRequests;
        private Double avgGpuUsage;
        private Double maxGpuUsage;
        private Double minGpuUsage;
    }
}