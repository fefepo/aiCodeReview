package com.aicodegem.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProblemRequestDto {
    private String title;
    private String description;
    private String inputExample;
    private String outputExample;
    private String constraints;
}
