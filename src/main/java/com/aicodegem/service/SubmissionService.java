package com.aicodegem.service;

import com.aicodegem.dto.SubmitResponseDTO;
import com.aicodegem.model.Problem;
import com.aicodegem.model.Submission;
import com.aicodegem.repository.ProblemRepository;
import com.aicodegem.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SubmissionService {
    private final SubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository;
    private final CodeExecutorService codeExecutorService;

    // ✅ 코드 제출 처리
    public Optional<Submission> submitCode(Long problemId, String userId, String code, String language) {
        Optional<Problem> problemOpt = problemRepository.findById(problemId);
        if (problemOpt.isEmpty())
            return Optional.empty();

        Problem problem = problemOpt.get();
        Submission submission = Submission.builder()
                .problemId(problemId)
                .userId(userId)
                .code(code)
                .language(language)
                .status("Pending")
                .build();
        return Optional.of(submissionRepository.save(submission));
    }

    // ✅ 제출된 코드 실행 및 검증
    public SubmitResponseDTO executeSubmission(Long submissionId) {
        Optional<Submission> submissionOpt = submissionRepository.findById(submissionId);
        if (submissionOpt.isEmpty())
            return new SubmitResponseDTO(false, "제출 내역을 찾을 수 없습니다.");

        Submission submission = submissionOpt.get();
        Optional<Problem> problemOpt = problemRepository.findById(submission.getProblemId());
        if (problemOpt.isEmpty())
            return new SubmitResponseDTO(false, "해당 문제를 찾을 수 없습니다.");

        Problem problem = problemOpt.get();
        List<String> inputs = problem.getInputExamples();
        List<String> expectedOutputs = problem.getOutputExamples();

        if (inputs.size() != expectedOutputs.size()) {
            return new SubmitResponseDTO(false, "문제의 테스트 케이스가 잘못 설정되었습니다.");
        }

        boolean isCorrect = true;
        for (int i = 0; i < inputs.size(); i++) {
            String actualOutput = codeExecutorService.executeCode(submission.getCode(), submission.getLanguage(),
                    inputs.get(i));
            if (!actualOutput.equals(expectedOutputs.get(i))) {
                isCorrect = false;
                break;
            }
        }

        submission.setStatus(isCorrect ? "Correct" : "Wrong Answer");
        submissionRepository.save(submission);

        return isCorrect ? new SubmitResponseDTO(true, "정답입니다!")
                : new SubmitResponseDTO(false, "오답입니다. 다시 시도해 보세요.");
    }
}
