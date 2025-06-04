package com.aicodegem.service;

import com.aicodegem.dto.RuleRequestDTO;
import com.aicodegem.model.Rule;
import com.aicodegem.model.RuleStatus;
import com.aicodegem.repository.RuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RuleService {
    private final RuleRepository ruleRepository;

    public Rule createRule(RuleRequestDTO dto) {
        Rule rule = Rule.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .status(RuleStatus.PENDING) // 🔹 처음 생성 시 PENDING
                .build();
        return ruleRepository.save(rule);
    }

    public List<Rule> getAllRules() {
        return ruleRepository.findAll();
    }

    public Optional<Rule> getRuleById(String id) {
        return ruleRepository.findById(id);
    }

    public Optional<Rule> updateRule(String id, RuleRequestDTO dto) {
        return ruleRepository.findById(id).map(rule -> {
            if (dto.getTitle() != null)
                rule.setTitle(dto.getTitle());
            if (dto.getDescription() != null)
                rule.setDescription(dto.getDescription());
            return ruleRepository.save(rule);
        });
    }

    public boolean deleteRule(String id) {
        if (ruleRepository.existsById(id)) {
            ruleRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // 🔹 규칙 승인
    public Optional<Rule> approveRule(String id) {
        return ruleRepository.findById(id).map(rule -> {
            rule.setStatus(RuleStatus.APPROVED);
            return ruleRepository.save(rule);
        });
    }

    // 🔹 규칙 거절
    public Optional<Rule> rejectRule(String id) {
        return ruleRepository.findById(id).map(rule -> {
            rule.setStatus(RuleStatus.REJECTED);
            return ruleRepository.save(rule);
        });
    }

    // ✅ 승인된 규칙만 가져오기
    public List<Rule> getApprovedRules() {
        return ruleRepository.findByStatus(RuleStatus.APPROVED);
    }

}
