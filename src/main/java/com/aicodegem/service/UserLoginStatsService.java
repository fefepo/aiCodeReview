package com.aicodegem.service;

import com.aicodegem.model.LoginRecord;
import com.aicodegem.model.User;
import com.aicodegem.repository.LoginRecordRepository;
import com.aicodegem.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UserLoginStatsService {

    private final LoginRecordRepository loginRecordRepository;
    private final UserRepository userRepository;

    public UserLoginStatsService(LoginRecordRepository loginRecordRepository, UserRepository userRepository) {
        this.loginRecordRepository = loginRecordRepository;
        this.userRepository = userRepository;
    }

    /*
     * 최근 N일간(기본 7일 등)의 일별 로그인 수를 계산
     * ROLE_USER 유저만 대상, 날짜별로 그룹화하여 개수 집계
     */
    public Map<LocalDate, Long> getDailyUserLoginCounts(int days) {
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(days - 1);

        List<LoginRecord> records = loginRecordRepository.findUserLoginsByDateRange(startDate, today);

        return records.stream()
                .collect(Collectors.groupingBy(LoginRecord::getLoginDate, Collectors.counting()));
    }

    /* 특정 사용자(userId)가 오늘 로그인한 기록이 있는지 확인 */
    public boolean existsByUserIdAndLoginDate(Long userId, LocalDate today) {
        return loginRecordRepository.existsByUser_IdAndLoginDate(userId, today);
    }

    /* 특정 사용자(userId)의 로그인 기록 저장 */
    public void saveLoginRecord(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음: " + userId));
        loginRecordRepository.save(new LoginRecord(user, LocalDate.now()));
    }

    /**
     * 특정 연도와 월에 대한 일별 로그인 수 조회
     * ROLE_USER 유저만 대상
     */
    public Map<LocalDate, Long> getUserLoginCountsByMonth(int year, int month) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        List<LoginRecord> records = loginRecordRepository.findUserLoginsByDateRange(start, end);

        return records.stream()
                .collect(Collectors.groupingBy(LoginRecord::getLoginDate, Collectors.counting()));
    }

}
