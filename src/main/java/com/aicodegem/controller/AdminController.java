package com.aicodegem.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

@RestController
public class AdminController {

    // @PreAuthorize("hasRole('ADMIN')")를 사용하면,
    // 현재 Authentication에 부여된 권한 중 "ROLE_ADMIN"이 있어야 접근할 수 있습니다.
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/api/admin/data")
    public ResponseEntity<String> getAdminData() {
        return ResponseEntity.ok("관리자 전용 데이터");
    }
}