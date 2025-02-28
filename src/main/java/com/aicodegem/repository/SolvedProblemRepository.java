package com.aicodegem.repository;

import com.aicodegem.model.SolvedProblem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SolvedProblemRepository extends JpaRepository<SolvedProblem, Long> {
    List<SolvedProblem> findByUserId(Long userId);
}
