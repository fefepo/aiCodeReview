package com.aicodegem.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TestCaseDto {
    private String input; // 테스트 케이스의 입력값
    private String expectedOutput; // 기대하는 출력값
}
