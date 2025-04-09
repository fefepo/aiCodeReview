package com.aicodegem.service;

import java.util.List;

import com.aicodegem.dto.RuleApprovalResponse;
import com.aicodegem.model.Rule;
import com.aicodegem.model.RuleRequest;

public interface RuleService {
    RuleRequest submitRuleRequest(RuleRequest request); // 규칙 추가 요청

    RuleApprovalResponse approveRuleRequest(String requestId, boolean isApproved); // 문제 승인 처리

    List<Rule> getAllRules(); // 모든 규칙 조회
}