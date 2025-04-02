package com.aicodegem.dto;

public class SubmitResponseDTO {
    private boolean success;
    private String message;

    public SubmitResponseDTO(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    // getters, setters
}
