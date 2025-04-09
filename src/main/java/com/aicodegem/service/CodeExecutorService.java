package com.aicodegem.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.*;

@Service
@RequiredArgsConstructor
public class CodeExecutorService {

    // ✅ 코드 실행 메서드만 유지
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
