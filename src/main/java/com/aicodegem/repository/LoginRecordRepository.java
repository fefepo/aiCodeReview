package com.aicodegem.repository;

import com.aicodegem.model.LoginRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface LoginRecordRepository extends JpaRepository<LoginRecord, Long> {

  // 특정 사용자(userId)가 특정 날짜(loginDate)에 로그인 기록이 존재하는지 확인
  boolean existsByUser_IdAndLoginDate(Long userId, LocalDate loginDate);

  // 특정 기간(start~end) 동안 로그인한 사용자 중 role이 "ROLE_USER"인 사용자들의 로그인 기록 조회
  @Query("""
          SELECT r FROM LoginRecord r
          WHERE r.loginDate BETWEEN :start AND :end
            AND r.user.role = 'ROLE_USER'
      """)
  List<LoginRecord> findUserLoginsByDateRange(LocalDate start, LocalDate end);
}
