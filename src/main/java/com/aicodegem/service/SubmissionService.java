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
    private final CodeService codeService;
    private final RankingService rankingService;

    public Optional<Submission> submitCode(String problemId, String userId, String code, String language) {
        if (problemRepository.findById(problemId).isEmpty())
            return Optional.empty();

        Submission submission = Submission.builder()
                .problemId(problemId)
                .userId(userId)
                .code(code)
                .language(language)
                .status("Pending")
                .build();
        return Optional.of(submissionRepository.save(submission));
    }

    public SubmitResponseDTO executeSubmission(String submissionId) {
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

        // ✅ 저장 전에 기존에 맞춘 적 있는지 먼저 확인
        boolean alreadySolved = submissionRepository.existsByUserIdAndProblemIdAndStatus(
                submission.getUserId(), submission.getProblemId(), "Correct");

        // ✅ 코드 실행 및 정답 여부 판별
        boolean isCorrect = true;
        StringBuilder resultOutput = new StringBuilder();
        for (int i = 0; i < inputs.size(); i++) {
            String actualOutput = codeService.executeCode(submission.getCode(), submission.getLanguage(),
                    inputs.get(i));
            resultOutput.append(actualOutput).append("\n");

            if (!actualOutput.trim().equals(expectedOutputs.get(i).trim())) {
                isCorrect = false;
                break;
            }
        }

        submission.setOutput(resultOutput.toString().trim());
        submission.setStatus(isCorrect ? "Correct" : "Wrong Answer");
        submissionRepository.save(submission);

        // ✅ 처음 정답 맞춘 경우에만 점수 부여
        if (isCorrect && !alreadySolved) {
            Long userId = Long.parseLong(submission.getUserId());
            rankingService.updateTotalScore(userId, 1);
        }

        return isCorrect ? new SubmitResponseDTO(true, "정답입니다! 🎉")
                : new SubmitResponseDTO(false, "오답입니다. 다시 시도해 보세요.");
    }

    public List<Submission> getAllSubmissions() {
        return submissionRepository.findAll();
    }

    public List<Submission> getSubmissionsByUser(String userId) {
        return submissionRepository.findByUserId(userId);
    }
}
