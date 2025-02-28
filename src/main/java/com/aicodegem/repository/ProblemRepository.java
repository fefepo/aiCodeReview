package com.aicodegem.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.aicodegem.model.Problem;

public interface ProblemRepository extends MongoRepository<Problem, String> {
    Page<Problem> findByTitleContaining(String title, Pageable pageable);
}
