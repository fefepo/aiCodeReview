package com.aicodegem.controller;

import com.aicodegem.dto.RuleRequestDTO;
import com.aicodegem.model.Rule;
import com.aicodegem.service.RuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/rules")
@RequiredArgsConstructor
public class RuleController {
    private final RuleService ruleService;

    // 규칙 생성
    @PostMapping
    public ResponseEntity<Rule> createRule(@RequestBody RuleRequestDTO dto) {
        Rule rule = ruleService.createRule(dto);
        return ResponseEntity.ok(rule);
    }

    // 모든 규칙 조회
    @GetMapping
    public ResponseEntity<List<Rule>> getAllRules() {
        return ResponseEntity.ok(ruleService.getAllRules());
    }

    // 승인된 규칙 조회
    @GetMapping("/admin")
    public ResponseEntity<List<Rule>> getAllApprovedRules() {
        List<Rule> approvedRules = ruleService.getApprovedRules();
        return ResponseEntity.ok(approvedRules);
    }

    // 특정 규칙 조회
    @GetMapping("/{id}")
    public ResponseEntity<Rule> getRuleById(@PathVariable String id) {
        return ruleService.getRuleById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 규칙 수정
    @PutMapping("/{id}")
    public ResponseEntity<Rule> updateRule(@PathVariable String id, @RequestBody RuleRequestDTO dto) {
        Optional<Rule> updated = ruleService.updateRule(id, dto);
        return updated.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 규칙 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRule(@PathVariable String id) {
        if (ruleService.deleteRule(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 규칙 승인 API
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveRule(@PathVariable String id) {
        return ruleService.approveRule(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 규칙 거절 API
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectRule(@PathVariable String id) {
        return ruleService.rejectRule(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
