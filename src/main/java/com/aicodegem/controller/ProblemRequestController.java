package com.aicodegem.controller;

import com.aicodegem.dto.ProblemRequestDTO;
import com.aicodegem.model.ProblemRequest;
import com.aicodegem.model.ProblemTest;
import com.aicodegem.model.Status;
import com.aicodegem.service.ProblemRequestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/problems")
public class ProblemRequestController {

    private final ProblemRequestService service;

    public ProblemRequestController(ProblemRequestService service) {
        this.service = service;
    }

    @PostMapping("/request") // 문제 추가 요청 생성
    public ResponseEntity<ProblemRequest> createRequest(@RequestBody ProblemRequestDTO problemRequestDTO) {
        // ProblemRequest 엔터티 생성 및 title, description 매핑
        ProblemRequest problemRequest = new ProblemRequest();
        problemRequest.setTitle(problemRequestDTO.getTitle());
        problemRequest.setDescription(problemRequestDTO.getDescription());

        // 만약 DTO에 tests 데이터가 있다면 엔터티의 ProblemTest 목록으로 매핑
        if (problemRequestDTO.getTests() != null && !problemRequestDTO.getTests().isEmpty()) {
            List<ProblemTest> testList = new ArrayList<>();
            for (ProblemRequestDTO.TestDTO testDTO : problemRequestDTO.getTests()) {
                ProblemTest test = new ProblemTest();
                test.setInput(testDTO.getInput());
                test.setExpectedOutput(testDTO.getExpectedOutput());
                // 양방향 연관관계 설정: 각 테스트 케이스에 현재 problemRequest를 연결
                test.setProblemRequest(problemRequest);
                testList.add(test);
            }
            problemRequest.setTests(testList);
        }

        // 문제 요청 생성 및 저장
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
