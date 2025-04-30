package com.aicodegem.service;

import com.aicodegem.dto.SubmitRequestDTO;
import com.aicodegem.dto.SubmitResponseDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubmitService {

    public SubmitResponseDTO evaluateCode(SubmitRequestDTO request) {
        List<String> testCases = request.getInputs();
        List<String> expectedOutputs = request.getExpectedOutputs();

        if (testCases.size() != expectedOutputs.size()) {
            return new SubmitResponseDTO(false, "테스트 케이스와 정답 개수가 일치하지 않습니다.");
        }

        boolean isCorrect = true;

        for (int i = 0; i < testCases.size(); i++) {
            String output = executeCode(request.getCode(), request.getLanguage(), testCases.get(i));
            if (!output.equals(expectedOutputs.get(i))) {
                isCorrect = false;
                break;
            }
        }

        return isCorrect ? new SubmitResponseDTO(true, "정답입니다!")
                : new SubmitResponseDTO(false, "오답입니다. 다시 시도해 보세요.");
    }

    private String executeCode(String code, String language, String input) {
        // 실제 코드 실행 로직 (Docker 또는 API 활용)
        return "output1"; // 임시 리턴값 (테스트용)
    }
}
