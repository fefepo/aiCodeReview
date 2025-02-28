package com.aicodegem.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.aicodegem.dto.RuleApprovalResponse;
import com.aicodegem.model.Rule;
import com.aicodegem.model.RuleRequest;
import com.aicodegem.model.RuleRequest.RequestStatus;
import com.aicodegem.repository.RuleRepository;
import com.aicodegem.repository.RuleRequestRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RuleServiceImpl implements RuleService {
    private final RuleRequestRepository ruleRequestRepository;
    private final RuleRepository ruleRepository;

    // 규칙 요청 제출 (사용자가 요청)
    public RuleRequest submitRuleRequest(RuleRequest request) {
        return ruleRequestRepository.save(request);
    }

    // 관리자 승인 처리
    public RuleApprovalResponse approveRuleRequest(String requestId, boolean isApproved) {
        RuleRequest request = ruleRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new IllegalStateException("이미 처리된 요청입니다");
        }

        request.setStatus(isApproved ? RequestStatus.APPROVED : RequestStatus.REJECTED);
        ruleRequestRepository.save(request);

        if (isApproved) {
            // RuleRequest의 데이터로 Rule 생성
            Rule rule = new Rule(
                    request.getName(),
                    request.getDescription(),
                    request.getCategory(),
                    request.isAICheck(),
                    request.getValidationPrompt());
            rule = ruleRepository.save(rule);
        }

        return new RuleApprovalResponse(requestId, request.getStatus());
    }

    // 모든 규칙 조회
    public List<Rule> getAllRules() {
        return ruleRepository.findAll();
    }
}