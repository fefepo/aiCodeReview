package com.aicodegem.service;

import org.springframework.stereotype.Service;
import com.aicodegem.model.ProblemRequest;
import com.aicodegem.model.ProblemTest;
import com.aicodegem.model.Status;
import com.aicodegem.repository.ProblemRequestRepository;
import com.aicodegem.dto.ProblemRequestDTO;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProblemRequestServiceImpl implements ProblemRequestService {

    private final ProblemRequestRepository repository;

    public ProblemRequestServiceImpl(ProblemRequestRepository repository) {
        this.repository = repository;
    }

    // DTO에서 엔터티로 매핑하여 문제 요청 생성
    public ProblemRequest createRequest(ProblemRequest problemRequest, ProblemRequestDTO dto) {
        // 기본 상태 설정
        problemRequest.setStatus(Status.PENDING);

        // 만약 DTO에 tests 데이터가 있다면, 이를 ProblemTest 엔터티로 변환하여 설정합니다.
        if (dto.getTests() != null && !dto.getTests().isEmpty()) {
            List<ProblemTest> testList = new ArrayList<>();
            for (ProblemRequestDTO.TestDTO testDTO : dto.getTests()) {
                ProblemTest test = new ProblemTest();
                test.setInput(testDTO.getInput());
                test.setExpectedOutput(testDTO.getExpectedOutput());
                // 양방향 연관관계 설정: 테스트 케이스에 현재 problemRequest 설정
                test.setProblemRequest(problemRequest);
                testList.add(test);
            }
            problemRequest.setTests(testList);
        }
        return repository.save(problemRequest);
    }

    @Override
    public ProblemRequest createRequest(ProblemRequest problemRequest) {
        // 테스트 정보를 처리하지 않는 기존 메서드 (오버로딩 등으로 활용 가능)
        return repository.save(problemRequest);
    }

    @Override
    public ProblemRequest approveRequest(Long id) {
        Optional<ProblemRequest> optionalRequest = repository.findByIdAndStatus(id, Status.PENDING);
        if (!optionalRequest.isPresent()) {
            throw new RuntimeException("Problem request not found or already processed");
        }
        ProblemRequest request = optionalRequest.get();
        request.setStatus(Status.APPROVED);
        return repository.save(request);
    }
}
