package com.aicodegem.dto;

import lombok.Getter;
import lombok.AllArgsConstructor;

@Getter
@AllArgsConstructor
public class SubmitResponseDTO {
    private boolean success;
    private String message;
}
