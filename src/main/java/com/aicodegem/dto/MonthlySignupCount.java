package com.aicodegem.dto;

// 월별 회원가입 수를 담는 DTO 클래스
public class MonthlySignupCount {
    private int month; // 월 (1~12)
    private long count; // 해당 월의 회원가입 수

    public MonthlySignupCount() {
    }

    public MonthlySignupCount(int month, long count) {
        this.month = month;
        this.count = count;
    }

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }
}
