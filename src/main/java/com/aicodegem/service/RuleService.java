package com.aicodegem.service;

import java.util.List;

import com.aicodegem.dto.RuleApprovalResponse;
import com.aicodegem.model.Rule;
import com.aicodegem.model.RuleRequest;

public interface RuleService {
    RuleRequest submitRuleRequest(RuleRequest request);

    RuleApprovalResponse approveRuleRequest(String requestId, boolean isApproved);

    List<Rule> getAllRules();
}