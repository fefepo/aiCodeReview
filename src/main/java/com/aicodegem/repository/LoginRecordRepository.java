package com.aicodegem.repository;

import com.aicodegem.model.LoginRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface LoginRecordRepository extends JpaRepository<LoginRecord, Long> {

    boolean existsByUser_IdAndLoginDate(Long userId, LocalDate loginDate);

    @Query("""
                SELECT r FROM LoginRecord r
                WHERE r.loginDate BETWEEN :start AND :end
                  AND r.user.role = 'ROLE_USER'
            """)
    List<LoginRecord> findUserLoginsByDateRange(LocalDate start, LocalDate end);
}
