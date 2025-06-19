package com.aicodegem.dto;

// 연도 정보를 담는 DTO 클래스
public class YearRequest {
    private int year; // 요청할 연도

    public YearRequest() {
    }

    public YearRequest(int year) {
        this.year = year;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }
}
