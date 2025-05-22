package com.aicodegem.service;

import com.aicodegem.dto.MonthlySignupCount;
import com.aicodegem.repository.SignupUserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SignupStatsServiceImpl implements SignupStatsService {

    private final SignupUserRepository signupUserRepository;

    public SignupStatsServiceImpl(SignupUserRepository signupUserRepository) {
        this.signupUserRepository = signupUserRepository;
    }

    @Override
    public List<MonthlySignupCount> getMonthlySignupCount(int year) {
        List<Object[]> results = signupUserRepository.findMonthlySignupCountByYearAndRoleUser(year);

        // month 1월 ~ 12월, count=0 초기값
        List<MonthlySignupCount> monthlyCounts = new ArrayList<>();
        for (int month = 1; month <= 12; month++) {
            monthlyCounts.add(new MonthlySignupCount(month, 0));
        }

        for (Object[] row : results) {
            Integer month = (Integer) row[0];
            Long count = (Long) row[1];
            monthlyCounts.set(month - 1, new MonthlySignupCount(month, count));
        }

        return monthlyCounts;
    }
}
