package com.aicodegem.repository;

import com.aicodegem.model.log.AIResponseTimeLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AIServerTimeLogRepository extends JpaRepository<AIResponseTimeLog, Long> {

        // 특정 기간 내의 로그 조회
        List<AIResponseTimeLog> findByRequestTimeBetweenOrderByRequestTimeAsc(
                        LocalDateTime startTime, LocalDateTime endTime);

        // 요청 유형별 로그 조회
        List<AIResponseTimeLog> findByRequestTypeOrderByRequestTimeDesc(String requestType);

        // 시간별 평균 처리 시간 조회 (일별)
        @Query("SELECT FUNCTION('DATE_FORMAT', a.requestTime, '%Y-%m-%d %H:00') as hour, " +
                        "AVG(a.processingTimeMs) as avgProcessingTime, " +
                        "MAX(a.processingTimeMs) as maxProcessingTime, " +
                        "MIN(a.processingTimeMs) as minProcessingTime, " +
                        "COUNT(a) as count " +
                        "FROM AIResponseTimeLog a " +
                        "WHERE a.requestTime >= :startTime " +
                        "GROUP BY FUNCTION('DATE_FORMAT', a.requestTime, '%Y-%m-%d %H:00') " +
                        "ORDER BY hour")
        List<Object[]> findHourlyProcessingTimeStats(@Param("startTime") LocalDateTime startTime);

        // 일별 평균 처리 시간 조회 (주별)
        @Query("SELECT FUNCTION('DATE_FORMAT', a.requestTime, '%Y-%m-%d') as day, " +
                        "AVG(a.processingTimeMs) as avgProcessingTime, " +
                        "MAX(a.processingTimeMs) as maxProcessingTime, " +
                        "MIN(a.processingTimeMs) as minProcessingTime, " +
                        "COUNT(a) as count " +
                        "FROM AIResponseTimeLog a " +
                        "WHERE a.requestTime >= :startTime " +
                        "GROUP BY FUNCTION('DATE_FORMAT', a.requestTime, '%Y-%m-%d') " +
                        "ORDER BY day")
        List<Object[]> findDailyProcessingTimeStats(@Param("startTime") LocalDateTime startTime);

        // 월별 평균 처리 시간 조회 (월별)
        @Query("SELECT FUNCTION('DATE_FORMAT', a.requestTime, '%Y-%m') as month, " +
                        "AVG(a.processingTimeMs) as avgProcessingTime, " +
                        "MAX(a.processingTimeMs) as maxProcessingTime, " +
                        "MIN(a.processingTimeMs) as minProcessingTime, " +
                        "COUNT(a) as count " +
                        "FROM AIResponseTimeLog a " +
                        "WHERE a.requestTime >= :startTime " +
                        "GROUP BY FUNCTION('DATE_FORMAT', a.requestTime, '%Y-%m') " +
                        "ORDER BY month")
        List<Object[]> findMonthlyProcessingTimeStats(@Param("startTime") LocalDateTime startTime);
}