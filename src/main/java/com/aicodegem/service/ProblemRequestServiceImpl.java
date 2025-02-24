package com.aicodegem.service;

import org.springframework.stereotype.Service;
import com.aicodegem.model.ProblemRequest;
import com.aicodegem.model.Status;
import com.aicodegem.repository.ProblemRequestRepository;
import java.util.Optional;

@Service // 서비스 계층을 나타내는 Spring 빈 선언
public class ProblemRequestServiceImpl implements ProblemRequestService {

    private final ProblemRequestRepository repository;

    // 생성자를 통한 의존성 주입
    public ProblemRequestServiceImpl(ProblemRequestRepository repository) {
        this.repository = repository;
    }

    @Override
    public ProblemRequest createRequest(ProblemRequest problemRequest) {
        // 새 문제 요청을 생성할 때 기본 상태를 PENDING으로 설정
        problemRequest.setStatus(Status.PENDING);
        return repository.save(problemRequest); // 데이터베이스에 저장
    }

    @Override
    public ProblemRequest approveRequest(Long id) {
        // ID와 상태가 PENDING인 문제 요청을 조회
        Optional<ProblemRequest> optionalRequest = repository.findByIdAndStatus(id, Status.PENDING);

        // 요청이 존재하지 않거나 이미 처리된 경우 예외 발생
        if (!optionalRequest.isPresent()) {
            throw new RuntimeException("Problem request not found or already processed");
        }

        // 요청을 승인 상태로 변경 후 저장
        ProblemRequest request = optionalRequest.get();
        request.setStatus(Status.APPROVED);
        return repository.save(request);
    }
}
