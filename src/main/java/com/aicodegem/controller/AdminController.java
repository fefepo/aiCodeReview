package com.aicodegem.controller;

import com.aicodegem.dto.AdminDTO;
import com.aicodegem.dto.GpuLogDTO;
import com.aicodegem.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    /**
     * 관리자 대시보드 데이터 조회
     */
    // @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/data")
    public ResponseEntity<List<AdminDTO.MonitoringData>> getDashboardData(
            @RequestParam(required = false, defaultValue = "day") String timeRange) {
        AdminDTO.AdminDashboardData data = adminService.getDashboardData(timeRange);
        return ResponseEntity.ok(data.getRecentData());
    }

    /**
     * 최근 GPU 로그 조회
     */
    // @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/logs")
    public ResponseEntity<List<GpuLogDTO.GpuLogResponse>> getRecentGpuLogs(
            @RequestParam(required = false, defaultValue = "20") int limit) {
        return ResponseEntity.ok(adminService.getRecentGpuLogs(limit));
    }

    /**
     * GPU ID별 로그 조회
     */
    // @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/logs/by-gpu/{gpuId}")
    public ResponseEntity<List<GpuLogDTO.GpuLogResponse>> getLogsByGpuId(
            @PathVariable Integer gpuId,
            @RequestParam(required = false, defaultValue = "10") int limit) {
        return ResponseEntity.ok(adminService.getLogsByGpuId(gpuId, limit));
    }

    /**
     * GPU 카드별 데이터 조회
     */
    // @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/cards")
    public ResponseEntity<List<GpuLogDTO.GpuCardData>> getGpuCardData() {
        return ResponseEntity.ok(adminService.getGpuCardData());
    }

    /**
     * GPU 통계 정보 조회
     */
    // @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/stats")
    public ResponseEntity<GpuLogDTO.GpuStatsResponse> getGpuStats() {
        return ResponseEntity.ok(adminService.getGpuStats());
    }

    /**
     * GPU 사용률 추이 조회
     */
    // @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/trends")
    public ResponseEntity<GpuLogDTO.GpuTrendResponse> getGpuTrends(
            @RequestParam(required = false, defaultValue = "24") int hours) {
        return ResponseEntity.ok(adminService.getGpuTrends(hours));
    }
}