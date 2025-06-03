package com.aicodegem.repository;

import com.aicodegem.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SignupUserRepository extends JpaRepository<User, Long> {

    // 연도별 월별 가입자 수 조회 쿼리
    @Query("SELECT MONTH(u.createdAt) AS month, COUNT(u) AS count " +
            "FROM User u " +
            "WHERE YEAR(u.createdAt) = :year AND u.role = 'ROLE_USER' " +
            "GROUP BY MONTH(u.createdAt)")
    List<Object[]> findMonthlySignupCountByYearAndRoleUser(@Param("year") int year);

}
