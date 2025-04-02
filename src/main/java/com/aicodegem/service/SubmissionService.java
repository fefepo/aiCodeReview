package com.aicodegem.service;

import com.aicodegem.model.Problem;
import com.aicodegem.model.Submission;
import com.aicodegem.repository.ProblemRepository;
import com.aicodegem.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SubmissionService {
    private final SubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository;

    // ✅ 코드 제출 로직
    public Optional<Submission> submitCode(Long problemId, String userId, String code, String language) {
        Optional<Problem> problem = problemRepository.findById(problemId);

        if (problem.isEmpty()) {
            return Optional.empty(); // 존재하지 않는 문제
        }

        Submission submission = Submission.builder()
                .problem(problem.get())
                .userId(userId)
                .code(code)
                .language(language)
                .status("Pending") // 기본 상태
                .output("N/A") // 기본 출력값
                .submittedAt(LocalDateTime.now())
                .build();

        return Optional.of(submissionRepository.save(submission));
    }
}
