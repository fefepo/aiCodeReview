package com.aicodegem.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.aicodegem.dto.ProblemRequestDTO;
import com.aicodegem.model.ProblemRequest;
import com.aicodegem.service.ProblemRequestService;

@RestController
@RequestMapping("/api/problems")
public class ProblemRequestController {

    private final ProblemRequestService service;

    public ProblemRequestController(ProblemRequestService service) {
        this.service = service;
    }

    @PostMapping("/request") // 문제 추가 요청 생성
    public ResponseEntity<ProblemRequest> createRequest(@RequestBody ProblemRequestDTO problemRequestDTO) {
        ProblemRequest problemRequest = new ProblemRequest();
        problemRequest.setTitle(problemRequestDTO.getTitle());
        problemRequest.setDescription(problemRequestDTO.getDescription());

        ProblemRequest createdRequest = service.createRequest(problemRequest);
        return new ResponseEntity<>(createdRequest, HttpStatus.CREATED);
    }

    @PutMapping("/approve/{id}") // 문제 추가 요청 승인
    public ResponseEntity<?> approveRequest(@PathVariable("id") Long id) {
        try {
            ProblemRequest approvedRequest = service.approveRequest(id);
            return ResponseEntity.ok(approvedRequest);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
