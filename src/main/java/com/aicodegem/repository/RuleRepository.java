package com.aicodegem.repository;

import com.aicodegem.model.Rule;
import com.aicodegem.model.RuleStatus;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface RuleRepository extends MongoRepository<Rule, String> {
    List<Rule> findByStatus(RuleStatus status); // 상태별 규칙 조회
}
