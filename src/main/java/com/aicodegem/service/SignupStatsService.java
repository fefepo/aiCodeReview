package com.aicodegem.service;

import com.aicodegem.dto.MonthlySignupCount;

import java.util.List;

public interface SignupStatsService {
    List<MonthlySignupCount> getMonthlySignupCount(int year);
}
