package com.aicodegem.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.aicodegem.model.RuleRequest;

public interface RuleRequestRepository extends MongoRepository<RuleRequest, String> {
}