package com.aicodegem.repository;

import com.aicodegem.model.TestCase;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestCaseRepository extends JpaRepository<TestCase, Long> {
    List<TestCase> findByProblemId(Long problemId); // 특정 문제의 테스트 케이스 조회
}
