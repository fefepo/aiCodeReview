package com.aicodegem.service;

import com.aicodegem.model.ProblemRequest;

// 문제 요청을 처리하는 서비스 인터페이스
public interface ProblemRequestService {

    // 새로운 문제 요청을 생성
    ProblemRequest createRequest(ProblemRequest problemRequest);

    // 특정 ID의 문제 요청을 승인
    ProblemRequest approveRequest(Long id);
}
