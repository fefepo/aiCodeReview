package com.aicodegem.repository;

import com.aicodegem.model.Problem;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {
    @Query("SELECT p FROM Problem p WHERE p.title LIKE %:query% OR p.content LIKE %:query% ORDER BY p.createdAt DESC")
    List<Problem> searchProblems(@Param("query") String query);
}
