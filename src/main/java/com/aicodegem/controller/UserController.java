package com.aicodegem.controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.aicodegem.dto.UserDTO;
import com.aicodegem.security.JwtUtil;
import com.aicodegem.service.UserService;
import com.aicodegem.service.UserLoginStatsService;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class); // 로깅을 위한 Logger

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserLoginStatsService userLoginStatsService;

    // 생성자 기반 의존성 주입
    public UserController(UserService userService, JwtUtil jwtUtil, PasswordEncoder passwordEncoder,
            UserLoginStatsService userLoginStatsService) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
        this.userLoginStatsService = userLoginStatsService;
    }

    // 회원가입 API
    @PostMapping("/signup")
    public ResponseEntity<String> registerUser(@RequestBody UserDTO userDTO) {
        logger.info("회원가입 요청: {}", userDTO.getUsername()); // 요청 로그
        String result = userService.registerUser(userDTO);
        logger.info("회원가입 성공: {}", userDTO.getUsername()); // 성공 로그
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    // 로그인 API
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody UserDTO userDTO) throws Exception {
        logger.info("로그인 시도: {}", userDTO.getUsername()); // 로그인 시도 로그

        // DB에서 사용자 정보 조회
        final UserDetails userDetails = userService.loadUserByUsername(userDTO.getUsername());

        // 비밀번호 일치 여부 확인
        if (!passwordEncoder.matches(userDTO.getPassword(), userDetails.getPassword())) {
            logger.error("로그인 실패: 잘못된 비밀번호 - {}", userDTO.getPassword()); // 실패 로그
            throw new Exception("Invalid credentials");
        }

        // 역할과 사용자 ID 조회
        String role = userService.getUserRole(userDTO.getUsername());
        Long userId = userService.getUserId(userDTO.getUsername());
        String username = userDTO.getUsername();

        // 하루 1회만 로그인 기록 저장 (role이 "ROLE_USER"인 경우만)
        if ("ROLE_USER".equals(role)) {
            LocalDate today = LocalDate.now();
            boolean alreadyLoggedInToday = userLoginStatsService.existsByUserIdAndLoginDate(userId, today);
            if (!alreadyLoggedInToday) {
                userLoginStatsService.saveLoginRecord(userId);
                logger.info("로그인 기록 저장 완료: userId={}, date={}", userId, today); // 기록 저장 로그
            } else {
                logger.info("오늘 이미 로그인 기록이 있음: userId={}, date={}", userId, today);
            }
        }

        // JWT 토큰 생성
        final String jwtToken = jwtUtil.generateToken(userDetails, role, username);

        // 응답 JSON 구성
        Map<String, String> response = new HashMap<>();
        response.put("token", jwtToken);

        logger.info("로그인 성공: {}", username); // 성공 로그
        return ResponseEntity.ok(response);
    }

    // 토큰 재발급 API
    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> refreshToken(@RequestHeader("Authorization") String token) {
        logger.info("토큰 리프레시 요청: {}", token.substring(7)); // 요청 로그

        // "Bearer " 접두사 제거
        String jwt = token.substring(7);
        String username = jwtUtil.extractUsername(jwt);
        UserDetails userDetails = userService.loadUserByUsername(username);

        // 토큰 유효성 검사 후 새로운 토큰 발급
        if (jwtUtil.validateToken(jwt, userDetails)) {
            String newToken = jwtUtil.generateToken(userDetails, jwtUtil.extractRole(jwt), username);
            Map<String, String> response = new HashMap<>();
            response.put("token", newToken);

            logger.info("새로운 토큰 생성 성공: {}", username);
            return ResponseEntity.ok(response);
        } else {
            logger.error("토큰 리프레시 실패: 유효하지 않은 토큰 - {}", username);
            return ResponseEntity.status(401).body(null);
        }
    }

    // 사용자 정보 수정 API
    @PutMapping("/update/{userId}")
    public ResponseEntity<String> updateUser(
            @PathVariable("userId") Long userId,
            @RequestParam("email") String email,
            @RequestParam("currentPassword") String currentPassword,
            @RequestParam("newPassword") String newPassword,
            @RequestParam("phoneNum") String phoneNum) {

        logger.info("사용자 정보 수정 요청: userId={}", userId); // 요청 로그

        // 서비스에 위임
        String result = userService.updateUserInfo(userId, email, currentPassword, newPassword, phoneNum);

        logger.info("사용자 정보 수정 완료: userId={}", userId); // 완료 로그
        return ResponseEntity.ok(result);
    }
}
