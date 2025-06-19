package com.aicodegem.service;

import com.aicodegem.dto.MonthlySignupCount;

import java.util.List;

public interface SignupStatsService {

    // 주어진 연도(year)에 대한 월별 회원가입 수 통계를 반환
    List<MonthlySignupCount> getMonthlySignupCount(int year);
}
