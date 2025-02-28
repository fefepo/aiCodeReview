package com.aicodegem.dto;

import com.aicodegem.model.RuleRequest.RequestStatus;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RuleApprovalResponse {
    private String requestId;
    private RequestStatus status;
}