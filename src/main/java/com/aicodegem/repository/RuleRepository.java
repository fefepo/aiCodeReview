package com.aicodegem.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.aicodegem.model.Rule;

public interface RuleRepository extends MongoRepository<Rule, String> {
    List<Rule> findByCategory(String category);
}
