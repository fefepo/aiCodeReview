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
            return loginStatsService.getUserLoginCountsByMonth(year, month);
        } else {
            int daysValue = (days != null) ? days : 7;
            return loginStatsService.getDailyUserLoginCounts(daysValue);
        }
    }

}
