package com.aicodegem.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.aicodegem.dto.RuleApprovalResponse;
import com.aicodegem.model.Rule;
import com.aicodegem.model.RuleRequest;
import com.aicodegem.service.RuleService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/rules")
@RequiredArgsConstructor
public class RuleController {
    private final RuleService ruleService;

    // 규칙 요청 제출 (사용자가 요청)
    @PostMapping("/request")
    public ResponseEntity<RuleRequest> submitRuleRequest(@RequestBody RuleRequest request) {
        RuleRequest savedRequest = ruleService.submitRuleRequest(request);
        return ResponseEntity.ok(savedRequest);
    }

    // 관리자 승인 처리
    @PostMapping("/approve/{requestId}")
    public ResponseEntity<RuleApprovalResponse> approveRuleRequest(
            @PathVariable String requestId,
            @RequestParam boolean isApproved) {
        RuleApprovalResponse response = ruleService.approveRuleRequest(requestId, isApproved);
        return ResponseEntity.ok(response);
    }

    // 모든 규칙 조회
    @GetMapping
    public ResponseEntity<List<Rule>> getAllRules() {
        List<Rule> rules = ruleService.getAllRules();
        return ResponseEntity.ok(rules);
    }
}
