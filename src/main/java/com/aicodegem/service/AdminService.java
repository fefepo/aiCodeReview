package com.aicodegem.service;

import java.util.List;

import com.aicodegem.dto.AdminDTO;
import com.aicodegem.dto.GpuLogDTO;

public interface AdminService {
    /**
     * 관리자 대시보드 데이터 조회
     * 
     * @param timeRange 시간 범위 (day, week, month)
     * @return 대시보드 데이터
     */
    AdminDTO.AdminDashboardData getDashboardData(String timeRange);

    /**
     * 최근 GPU 로그 조회
     * 
     * @param limit 조회할 로그 수
     * @return GPU 로그 목록
     */
    List<GpuLogDTO.GpuLogResponse> getRecentGpuLogs(int limit);

    /**
     * GPU ID별 로그 조회
     * 
     * @param gpuId GPU ID
     * @param limit 조회할 로그 수
     * @return GPU 로그 목록
     */
    List<GpuLogDTO.GpuLogResponse> getLogsByGpuId(Integer gpuId, int limit);

    /**
     * GPU 카드별 데이터 조회
     * 
     * @return GPU 카드 데이터 목록
     */
    List<GpuLogDTO.GpuCardData> getGpuCardData();

    /**
     * GPU 통계 정보 조회
     * 
     * @return GPU 통계 정보
     */
    GpuLogDTO.GpuStatsResponse getGpuStats();

    /**
     * GPU 사용률 추이 조회
     * 
     * @param hours 조회할 시간 범위 (시간)
     * @return GPU 사용률 추이 데이터
     */
    GpuLogDTO.GpuTrendResponse getGpuTrends(int hours);
}
