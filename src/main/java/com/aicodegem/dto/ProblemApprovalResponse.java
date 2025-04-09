package com.aicodegem.dto;

import com.aicodegem.model.ProblemRequest.RequestStatus;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProblemApprovalResponse {
    private String requestId;
    private RequestStatus status;
}