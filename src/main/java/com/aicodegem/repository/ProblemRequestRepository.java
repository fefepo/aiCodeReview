package com.aicodegem.repository;

import com.aicodegem.model.ProblemRequest;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProblemRequestRepository extends MongoRepository<ProblemRequest, Long> {
}
