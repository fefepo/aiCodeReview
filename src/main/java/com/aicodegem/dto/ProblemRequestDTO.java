package com.aicodegem.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProblemRequestDTO {
    private String title;

    @JsonProperty("description")
    private String content;

    private String answer;
}
