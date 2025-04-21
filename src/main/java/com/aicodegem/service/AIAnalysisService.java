package com.aicodegem.service;

import java.io.IOException;

import com.aicodegem.model.CodeSubmission;

public interface AIAnalysisService {
    /** 코드 분석(제출) */
    int analyzeCode(String code) throws IOException;

    /** 피드백 생성 */
    String generateFeedback(String code) throws IOException;

    /** 코드 db 저장 */
    CodeSubmission analyzeAndStoreCode(String userId, String code, String title) throws IOException;
}
