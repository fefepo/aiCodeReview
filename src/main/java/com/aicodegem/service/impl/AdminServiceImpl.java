package com.aicodegem.service.impl;

import com.aicodegem.dto.AdminDTO;
import com.aicodegem.dto.GpuLogDTO;
import com.aicodegem.model.log.AIResponseTimeLog;
import com.aicodegem.model.log.AIServerUsageLog;
import com.aicodegem.repository.AIServerUsageLogRepository;
import com.aicodegem.repository.AIServerTimeLogRepository;
import com.aicodegem.service.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    private final AIServerUsageLogRepository aiServerUsageLogRepository;
    private final AIServerTimeLogRepository aiServerTimeLogRepository;

    /**
     * 시간 범위에 따른 시작 시간 계산
     */
    private LocalDateTime calculateStartTime(String timeRange) {
        LocalDateTime now = LocalDateTime.now();

        switch (timeRange) {
            case "day":
                return now.minusDays(1);
            case "week":
                return now.minusWeeks(1);
            case "month":
                return now.minusMonths(1);
            default:
                return now.minusDays(1);
        }
    }

    /**
     * 관리자 대시보드 데이터 조회
     */
    public AdminDTO.AdminDashboardData getDashboardData(String timeRange) {
        LocalDateTime startTime = calculateStartTime(timeRange);

        // 시간 범위에 따른 시계열 데이터 조회
        AdminDTO.TimeSeriesData timeSeriesData = getTimeSeriesData(timeRange, startTime);

        // 최근 모니터링 데이터 조회
        List<AdminDTO.MonitoringData> recentData = getRecentMonitoringData(startTime);

        // 통계 데이터 계산
        AdminDTO.StatsData statsData = calculateStats(startTime);

        return AdminDTO.AdminDashboardData.builder()
                .timeSeriesData(timeSeriesData)
                .recentData(recentData)
                .stats(statsData)
                .build();
    }

    /**
     * Int형태로 정의 된거 Double로 변경
     */
    private Double convertToDouble(Object value) {
        if (value == null) {
            return 0.0;
        }

        if (value instanceof Double) {
            return (Double) value;
        } else if (value instanceof Integer) {
            return ((Integer) value).doubleValue();
        } else if (value instanceof Long) {
            return ((Long) value).doubleValue();
        } else if (value instanceof Float) {
            return ((Float) value).doubleValue();
        } else if (value instanceof Number) {
            return ((Number) value).doubleValue();
        }

        try {
            return Double.parseDouble(value.toString());
        } catch (Exception e) {
            return 0.0;
        }
    }

    /**
     * 시간 범위에 따른 시계열 데이터 조회
     */
    private AdminDTO.TimeSeriesData getTimeSeriesData(String timeRange, LocalDateTime startTime) {
        List<Object[]> stats;

        // 시간 범위에 따라 다른 쿼리 사용
        switch (timeRange) {
            case "day":
                stats = aiServerTimeLogRepository.findHourlyProcessingTimeStats(startTime);
                break;
            case "week":
                stats = aiServerTimeLogRepository.findDailyProcessingTimeStats(startTime);
                break;
            case "month":
                stats = aiServerTimeLogRepository.findMonthlyProcessingTimeStats(startTime);
                break;
            default:
                stats = aiServerTimeLogRepository.findHourlyProcessingTimeStats(startTime);
        }

        // 결과 변환
        List<String> timeLabels = new ArrayList<>();
        List<Double> avgProcessingTimes = new ArrayList<>();
        List<Double> maxProcessingTimes = new ArrayList<>();
        List<Double> minProcessingTimes = new ArrayList<>();
        List<Long> counts = new ArrayList<>();

        for (Object[] stat : stats) {
            timeLabels.add((String) stat[0]);

            avgProcessingTimes.add(convertToDouble(stat[1]));
            maxProcessingTimes.add(convertToDouble(stat[2]));
            minProcessingTimes.add(convertToDouble(stat[3]));

            if (stat[4] instanceof Number) {
                counts.add(((Number) stat[4]).longValue());
            } else {
                counts.add(0L);
            }
        }

        return AdminDTO.TimeSeriesData.builder()
                .timeLabels(timeLabels)
                .avgProcessingTimes(avgProcessingTimes)
                .maxProcessingTimes(maxProcessingTimes)
                .minProcessingTimes(minProcessingTimes)
                .counts(counts)
                .build();
    }

    /**
     * 최근 모니터링 데이터 조회
     */
    private List<AdminDTO.MonitoringData> getRecentMonitoringData(LocalDateTime startTime) {
        // 응답 시간 로그 조회
        List<AIResponseTimeLog> responseLogs = aiServerTimeLogRepository
                .findByRequestTimeBetweenOrderByRequestTimeAsc(startTime, LocalDateTime.now());

        // GPU 사용량 로그 조회
        List<AIServerUsageLog> gpuLogs = aiServerUsageLogRepository
                .findByCreatedAtBetweenOrderByCreatedAtDesc(startTime, LocalDateTime.now());

        // 결과 변환 (응답 시간 로그 기준)
        List<AdminDTO.MonitoringData> result = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;

        for (AIResponseTimeLog log : responseLogs) {
            // 해당 시간에 가장 가까운 GPU 로그 찾기
            Double gpuUsage = gpuLogs.stream()
                    .filter(g -> Math.abs(g.getCreatedAt().toLocalTime().toSecondOfDay() -
                            log.getRequestTime().toLocalTime().toSecondOfDay()) < 600)
                    .findFirst()
                    .map(AIServerUsageLog::getAvgGpuUtil)
                    .orElse(0.0);

            result.add(AdminDTO.MonitoringData.builder()
                    .timestamp(log.getRequestTime().format(formatter))
                    .responseTime((double) log.getProcessingTimeMs())
                    .gpuUsage(gpuUsage)
                    .build());
        }

        return result;
    }

    /**
     * 통계 데이터 계산
     */
    private AdminDTO.StatsData calculateStats(LocalDateTime startTime) {
        // 응답 시간 로그 조회
        List<AIResponseTimeLog> responseLogs = aiServerTimeLogRepository
                .findByRequestTimeBetweenOrderByRequestTimeAsc(startTime, LocalDateTime.now());

        // GPU 사용량 로그 조회
        List<AIServerUsageLog> gpuLogs = aiServerUsageLogRepository
                .findByCreatedAtBetweenOrderByCreatedAtDesc(startTime, LocalDateTime.now());

        // 응답 시간 통계 계산
        double avgResponseTime = responseLogs.stream()
                .mapToInt(AIResponseTimeLog::getProcessingTimeMs)
                .average()
                .orElse(0.0);

        double maxResponseTime = responseLogs.stream()
                .mapToInt(AIResponseTimeLog::getProcessingTimeMs)
                .max()
                .orElse(0);

        double minResponseTime = responseLogs.stream()
                .mapToInt(AIResponseTimeLog::getProcessingTimeMs)
                .min()
                .orElse(0);

        long totalRequests = responseLogs.size();

        // GPU 사용량 통계 계산
        double avgGpuUsage = gpuLogs.stream()
                .mapToDouble(AIServerUsageLog::getAvgGpuUtil)
                .average()
                .orElse(0.0);

        double maxGpuUsage = gpuLogs.stream()
                .mapToDouble(AIServerUsageLog::getMaxGpuUtil)
                .max()
                .orElse(0.0);

        double minGpuUsage = gpuLogs.stream()
                .mapToDouble(AIServerUsageLog::getAvgGpuUtil)
                .min()
                .orElse(0.0);

        return AdminDTO.StatsData.builder()
                .avgResponseTime(avgResponseTime)
                .maxResponseTime(maxResponseTime)
                .minResponseTime(minResponseTime)
                .totalRequests(totalRequests)
                .avgGpuUsage(avgGpuUsage)
                .maxGpuUsage(maxGpuUsage)
                .minGpuUsage(minGpuUsage)
                .build();
    }

    /**
     * 최근 GPU 로그 조회
     */
    public List<GpuLogDTO.GpuLogResponse> getRecentGpuLogs(int limit) {
        List<AIServerUsageLog> logs;

        if (limit > 0) {
            // 최근 N개 로그만 조회
            logs = aiServerUsageLogRepository.findAll().stream()
                    .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                    .limit(limit)
                    .collect(Collectors.toList());
        } else {
            // 모든 로그 조회
            logs = aiServerUsageLogRepository.findAll().stream()
                    .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                    .collect(Collectors.toList());
        }

        return GpuLogDTO.GpuLogResponse.fromList(logs);
    }

    /**
     * GPU ID별 로그 조회
     */
    public List<GpuLogDTO.GpuLogResponse> getLogsByGpuId(Integer gpuId, int limit) {
        List<AIServerUsageLog> logs = aiServerUsageLogRepository.findByGpuIdOrderByCreatedAtDesc(gpuId);

        if (limit > 0 && logs.size() > limit) {
            logs = logs.subList(0, limit);
        }

        return GpuLogDTO.GpuLogResponse.fromList(logs);
    }

    /**
     * GPU 카드별 데이터 조회
     */
    public List<GpuLogDTO.GpuCardData> getGpuCardData() {
        // 모든 로그 조회
        List<AIServerUsageLog> allLogs = aiServerUsageLogRepository.findAll();

        // GPU ID별로 그룹화
        Map<Integer, List<AIServerUsageLog>> logsByGpuId = allLogs.stream()
                .collect(Collectors.groupingBy(AIServerUsageLog::getGpuId));

        // 각 GPU에 대한 카드 데이터 생성
        List<GpuLogDTO.GpuCardData> cardDataList = new ArrayList<>();

        for (Map.Entry<Integer, List<AIServerUsageLog>> entry : logsByGpuId.entrySet()) {
            Integer gpuId = entry.getKey();
            List<AIServerUsageLog> gpuLogs = entry.getValue();

            // 최근 10개 로그만 사용
            List<AIServerUsageLog> recentLogs = gpuLogs.stream()
                    .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                    .limit(10)
                    .collect(Collectors.toList());

            // GPU 이름 가져오기 (첫 번째 로그에서)
            String gpuName = recentLogs.isEmpty() ? "Unknown GPU" : recentLogs.get(0).getGpuName();

            GpuLogDTO.GpuCardData cardData = GpuLogDTO.GpuCardData.builder()
                    .gpuId(gpuId)
                    .gpuName(gpuName)
                    .recentLogs(GpuLogDTO.GpuLogResponse.fromList(recentLogs))
                    .build();

            cardDataList.add(cardData);
        }

        return cardDataList;
    }

    /**
     * GPU 통계 정보 조회
     */
    public GpuLogDTO.GpuStatsResponse getGpuStats() {
        Double avgWebsocketUtil = aiServerUsageLogRepository.calculateAverageGpuUtilByRequestType("websocket");
        Double avgStreamingUtil = aiServerUsageLogRepository.calculateAverageGpuUtilByRequestType("streaming");

        // 최대 GPU 사용률 계산
        Double maxGpuUtil = aiServerUsageLogRepository.findAll().stream()
                .mapToDouble(AIServerUsageLog::getMaxGpuUtil)
                .max()
                .orElse(0.0);

        // 총 로그 수
        long totalLogs = aiServerUsageLogRepository.count();

        return GpuLogDTO.GpuStatsResponse.builder()
                .avgWebsocketGpuUtil(avgWebsocketUtil != null ? avgWebsocketUtil : 0.0)
                .avgStreamingGpuUtil(avgStreamingUtil != null ? avgStreamingUtil : 0.0)
                .maxGpuUtil(maxGpuUtil)
                .totalLogs(totalLogs)
                .build();
    }

    /**
     * GPU 사용률 추이 조회
     */
    public GpuLogDTO.GpuTrendResponse getGpuTrends(int hours) {
        LocalDateTime startTime = LocalDateTime.now().minusHours(hours);

        List<Object[]> hourlyStats = aiServerUsageLogRepository.findHourlyGpuUtilization(startTime);

        List<String> timeLabels = new ArrayList<>();
        List<Double> avgGpuUtils = new ArrayList<>();
        List<Double> maxGpuUtils = new ArrayList<>();

        for (Object[] stat : hourlyStats) {
            timeLabels.add((String) stat[0]);
            avgGpuUtils.add((Double) stat[1]);
            maxGpuUtils.add((Double) stat[2]);
        }

        return GpuLogDTO.GpuTrendResponse.builder()
                .timeLabels(timeLabels)
                .avgGpuUtils(avgGpuUtils)
                .maxGpuUtils(maxGpuUtils)
                .build();
    }
}
