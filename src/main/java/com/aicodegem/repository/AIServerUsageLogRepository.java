package com.aicodegem.repository;

import com.aicodegem.model.log.AIServerUsageLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AIServerUsageLogRepository extends JpaRepository<AIServerUsageLog, Long> {

    // GPU ID별 로그 조회 (최신순)
    List<AIServerUsageLog> findByGpuIdOrderByCreatedAtDesc(Integer gpuId);

    // 요청 유형별 로그 조회 (최신순)
    List<AIServerUsageLog> findByRequestTypeOrderByCreatedAtDesc(String requestType);

    // 특정 기간 내 로그 조회 (최신순)
    List<AIServerUsageLog> findByCreatedAtBetweenOrderByCreatedAtDesc(
            LocalDateTime startTime, LocalDateTime endTime);

    // 최근 N개 로그 조회
    List<AIServerUsageLog> findTop10ByOrderByCreatedAtDesc();

    // 요청 유형별 평균 GPU 사용률 계산
    @Query("SELECT AVG(a.avgGpuUtil) FROM AIServerUsageLog a WHERE a.requestType = :requestType")
    Double calculateAverageGpuUtilByRequestType(@Param("requestType") String requestType);

    // 시간별 GPU 사용률 통계 조회
    @Query("SELECT FUNCTION('DATE_FORMAT', a.createdAt, '%Y-%m-%d %H:00') as hour, " +
            "AVG(a.avgGpuUtil) as avgUtil, MAX(a.maxGpuUtil) as maxUtil " +
            "FROM AIServerUsageLog a " +
            "WHERE a.createdAt >= :startTime " +
            "GROUP BY FUNCTION('DATE_FORMAT', a.createdAt, '%Y-%m-%d %H:00') " +
            "ORDER BY hour")
    List<Object[]> findHourlyGpuUtilization(@Param("startTime") LocalDateTime startTime);
}