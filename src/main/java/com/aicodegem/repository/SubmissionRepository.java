package com.aicodegem.repository;

import com.aicodegem.model.Submission;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SubmissionRepository extends MongoRepository<Submission, String> {
    List<Submission> findByUserId(String userId);

    List<Submission> findByProblemId(String problemId);

    // ✅ 사용자-문제-정답 여부 확인용 메서드
    boolean existsByUserIdAndProblemIdAndStatus(String userId, String problemId, String status);
}
