package com.aicodegem.service;

import com.aicodegem.model.Submission;
import com.aicodegem.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.*;

@Service
@RequiredArgsConstructor
public class CodeExecutorService {
    private final SubmissionRepository submissionRepository;

    // ✅ 코드 실행
    public void executeSubmission(Long submissionId) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new IllegalArgumentException("Submission not found"));

        try {
            // 파일 생성 후 절대 경로 사용
            String fileName = "submission.py";
            File file = new File(fileName);
            try (BufferedWriter writer = new BufferedWriter(new FileWriter(file))) {
                writer.write(submission.getCode());
            }

            // ProcessBuilder에 작업 디렉토리 지정
            ProcessBuilder builder = new ProcessBuilder("python3", file.getAbsolutePath());
            builder.directory(new File("C:\\project25\\Start")); // 작업 디렉토리 지정
            builder.redirectErrorStream(true);
            Process process = builder.start();

            // 3️⃣ 실행 결과 정확히 읽기
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n"); // 실제 실행된 코드의 출력값만 저장
            }
            process.waitFor();

            // 4️⃣ 실행 결과 저장 (trim 적용)
            submission.setStatus("Success");
            submission.setOutput(output.toString().trim()); // 불필요한 개행 문자 제거
        } catch (Exception e) {
            submission.setStatus("Failed");
            submission.setOutput("Execution Error: " + e.getMessage()); // 상세 오류 메시지 반환
        }

        submissionRepository.save(submission);
    }
}
