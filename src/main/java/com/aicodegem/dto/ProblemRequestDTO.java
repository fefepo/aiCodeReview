package com.aicodegem.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class ProblemRequestDTO {
    private String title;
    private String description;
    private List<String> inputExamples; // 여러 개의 입력 예제
    private List<String> outputExamples; // 여러 개의 출력 예제
    private String constraints;
    private String createdBy; // 🔹 문제 작성자 필드 추가
    private Integer option; // 문제 유형 추가 (0: 코드 개선용, 1: 알고리즘 로직용 2: 테스트 케이스용)
    private String rule; // 규칙 제목 필드
}
