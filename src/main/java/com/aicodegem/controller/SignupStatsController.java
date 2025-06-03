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

    public SignupStatsController(SignupStatsService signupStatsService) {
        this.signupStatsService = signupStatsService;
    }

    // GET 요청: /api/signup-stats?year=2025
    @GetMapping
    public List<MonthlySignupCount> getMonthlySignupStats(@RequestParam int year) {
        return signupStatsService.getMonthlySignupCount(year);
    }
}
