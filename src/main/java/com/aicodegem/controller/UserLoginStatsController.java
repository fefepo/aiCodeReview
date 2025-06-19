package com.aicodegem.controller;

import com.aicodegem.service.UserLoginStatsService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserLoginStatsController {

    private final UserLoginStatsService loginStatsService;

    public UserLoginStatsController(UserLoginStatsService loginStatsService) {
        this.loginStatsService = loginStatsService;
    }

    // 기본 최근 7일 데이터 조회
    @GetMapping("/login-stats")
    public Map<LocalDate, Long> getUserLoginStats(
            @RequestParam(required = false) Integer days,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {

        if (year != null && month != null) {
            // 특정 연월의 로그인 통계 조회
            return loginStatsService.getUserLoginCountsByMonth(year, month);
        } else {
            // 최근 days일 동안 로그인 통계 조회 (기본 7일)
            int daysValue = (days != null) ? days : 7;
            return loginStatsService.getDailyUserLoginCounts(daysValue);
        }
    }

}
