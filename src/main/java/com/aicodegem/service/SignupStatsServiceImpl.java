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

    /**
     * 특정 연도에 대한 월별 회원가입 수를 계산하여 반환
     * 가입자가 없는 월도 count=0으로 포함하여 총 12개월 데이터 반환
     */
    @Override
    public List<MonthlySignupCount> getMonthlySignupCount(int year) {
        // DB에서 (월, 가입자 수) 결과 조회
        List<Object[]> results = signupUserRepository.findMonthlySignupCountByYearAndRoleUser(year);

        // 1월부터 12월까지 count=0으로 초기화된 리스트 생성
        List<MonthlySignupCount> monthlyCounts = new ArrayList<>();
        for (int month = 1; month <= 12; month++) {
            monthlyCounts.add(new MonthlySignupCount(month, 0));
        }

        // 결과를 리스트에 반영 (월은 1부터 시작하므로 index는 month-1)
        for (Object[] row : results) {
            Integer month = (Integer) row[0];
            Long count = (Long) row[1];
            monthlyCounts.set(month - 1, new MonthlySignupCount(month, count));
        }

        return monthlyCounts;
    }
}
