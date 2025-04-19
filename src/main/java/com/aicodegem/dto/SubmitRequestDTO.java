package com.aicodegem.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SubmitRequestDTO {
    private String code; // 제출한 코드
    private String language; // 프로그래밍 언어
    private List<String> inputs; // 여러 개의 입력값 리스트
    private List<String> expectedOutputs; // 기대 출력값 리스트
}
