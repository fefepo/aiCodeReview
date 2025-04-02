package com.aicodegem.service;

import com.aicodegem.dto.SubmitResponseDTO;
import com.aicodegem.model.Problem;
import com.aicodegem.model.Submission;
import com.aicodegem.repository.ProblemRepository;
import com.aicodegem.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CodeExecutorService {
    private final SubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository; // ✅ 추가

    // ✅ 제출된 코드 실행
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

        // ✅ 출력값을 리스트로 변환하여 비교
        String[] actualOutputs = submission.getOutput().split("\\r?\\n"); // 개행 기준 분할
        if (actualOutputs.length != expectedOutputs.size()) {
            return new SubmitResponseDTO(false, "출력 개수가 맞지 않습니다.");
        }

        boolean isCorrect = true;
        for (int i = 0; i < expectedOutputs.size(); i++) {
            if (!actualOutputs[i].trim().equals(expectedOutputs.get(i).trim())) { // ✅ trim() 적용 후 비교
                isCorrect = false;
                break;
            }
        }

        submission.setStatus(isCorrect ? "Correct" : "Wrong Answer");
        submissionRepository.save(submission);

        return isCorrect ? new SubmitResponseDTO(true, "정답입니다! 🎉")
                : new SubmitResponseDTO(false, "오답입니다. 다시 시도해 보세요.");
    }

    // ✅ 코드 실행 메서드 (변경 없음)
    public String executeCode(String code, String language, String input) {
        try {
            String fileName = "submission.py";
            File file = new File(fileName);
            try (BufferedWriter writer = new BufferedWriter(new FileWriter(file))) {
                writer.write(code);
            }

            ProcessBuilder builder = new ProcessBuilder("python3", file.getAbsolutePath());
            builder.redirectErrorStream(true);
            Process process = builder.start();

            BufferedWriter processInput = new BufferedWriter(new OutputStreamWriter(process.getOutputStream()));
            processInput.write(input);
            processInput.newLine();
            processInput.flush();
            processInput.close();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
            process.waitFor();

            return output.toString().trim();
        } catch (Exception e) {
            return "Execution Error: " + e.getMessage();
        }
    }
}
