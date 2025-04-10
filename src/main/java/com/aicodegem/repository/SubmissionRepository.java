package com.aicodegem.repository;

import com.aicodegem.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByUserId(String userId);

    List<Submission> findByProblemId(Long problemId);
}
