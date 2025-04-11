package com.aicodegem.repository;

import com.aicodegem.model.Problem;
import com.aicodegem.model.ProblemStatus;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProblemRepository extends JpaRepository<Problem, Long> {
    // ProblemRepository.java
    List<Problem> findByStatus(ProblemStatus status);
}