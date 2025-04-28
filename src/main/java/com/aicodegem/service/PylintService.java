
package com.aicodegem.service;

import org.springframework.stereotype.Service;

import java.io.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class PylintService {

    private final String PYTHON_SCRIPT_PATH = "./pylint_runner.py"; // pylint_runner.py 파일 경로

    public PylintResult runPylint(String code) throws IOException, InterruptedException {
        // 임시 Python 파일 생성
        File tempFile = File.createTempFile("code", ".py");
        try (FileWriter writer = new FileWriter(tempFile)) {
            writer.write(code);
        }

        // Python 스크립트를 호출하여 Pylint 실행
        ProcessBuilder processBuilder = new ProcessBuilder("python", PYTHON_SCRIPT_PATH, tempFile.getAbsolutePath());
        processBuilder.redirectErrorStream(true);

        Process process = processBuilder.start();
        StringBuilder pylintOutput = new StringBuilder();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                pylintOutput.append(line).append("\n");
            }
        }

        // 임시 파일 삭제
        tempFile.delete();

        int exitCode = process.waitFor();
        System.out.println("Pylint 종료 코드: " + exitCode); // <- 로그만 남기고 무시

        // Pylint 점수 파싱
        double score = parseScore(pylintOutput.toString());
        return new PylintResult(pylintOutput.toString(), score);
    }

    private double parseScore(String pylintOutput) { // 긴 문자열로 나오는 pylint점수 점수만 파싱
        Pattern pattern = Pattern.compile("Your code has been rated at ([0-9.]+)/10");
        Matcher matcher = pattern.matcher(pylintOutput);
        if (matcher.find()) {
            return Double.parseDouble(matcher.group(1));
        }
        return 0.0;
    }

    public static class PylintResult {
        private final String output;
        private final double score;

        public PylintResult(String output, double score) {
            this.output = output;
            this.score = score;
        }

        public String getOutput() {
            return output;
        }

        public double getScore() {
            return score;
        }
    }
}