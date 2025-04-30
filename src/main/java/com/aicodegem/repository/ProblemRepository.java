package com.aicodegem.repository;

import com.aicodegem.model.Problem;
import com.aicodegem.model.ProblemStatus;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProblemRepository extends MongoRepository<Problem, String> {
    List<Problem> findByStatus(ProblemStatus status);
}