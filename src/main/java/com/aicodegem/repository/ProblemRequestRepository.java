package com.aicodegem.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.aicodegem.model.ProblemRequest;
import com.aicodegem.model.Status;

// ProblemRequest 엔터티에 대한 JPA 리포지토리 인터페이스
public interface ProblemRequestRepository extends JpaRepository<ProblemRequest, Long> {

    // 특정 ID와 상태를 가진 문제 요청을 조회
    Optional<ProblemRequest> findByIdAndStatus(Long id, Status status);
}
