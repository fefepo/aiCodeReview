package com.aicodegem.controller;

import com.aicodegem.dto.MonthlySignupCount;
import com.aicodegem.dto.YearRequest;
import com.aicodegem.service.SignupStatsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/signup-stats")
public class SignupStatsController {

    private final SignupStatsService signupStatsService;

    // 생성자 주입으로 서비스 객체 주입
    public SignupStatsController(SignupStatsService signupStatsService) {
        this.signupStatsService = signupStatsService;
    }

    // 연도(year)를 쿼리 파라미터로 받아 월별 회원가입 수 통계 조회
    @GetMapping
    public List<MonthlySignupCount> getMonthlySignupStats(@RequestParam int year) {
        return signupStatsService.getMonthlySignupCount(year);
    }
}