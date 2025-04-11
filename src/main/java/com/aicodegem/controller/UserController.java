package com.aicodegem.controller;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.aicodegem.service.UserService;
import com.aicodegem.dto.UserDTO;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.aicodegem.security.JwtUtil;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class); // Logger 생성

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserController(UserService userService, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<String> registerUser(@RequestBody UserDTO userDTO) {
        logger.info("회원가입 요청: {}", userDTO.getUsername()); // 회원가입 요청 로그
        String result = userService.registerUser(userDTO);
        logger.info("회원가입 성공: {}", userDTO.getUsername()); // 회원가입 성공 로그
        return ResponseEntity.status(HttpStatus.OK).body(result);

    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody UserDTO userDTO) throws Exception {
        logger.info("로그인 시도: {}", userDTO.getUsername()); // 로그인 시도 로그

        // 유저를 로드
        final UserDetails userDetails = userService.loadUserByUsername(userDTO.getUsername());

        // 비밀번호가 일치하는지 확인
        if (!passwordEncoder.matches(userDTO.getPassword(), userDetails.getPassword())) {
            logger.error("로그인 실패: 잘못된 비밀번호 - {}", userDTO.getPassword()); // 로그인 실패 로그
            throw new Exception("Invalid credentials");
        }

        // 사용자 역할과 ID 가져오기
        String role = userService.getUserRole(userDTO.getUsername());
        String username = userDTO.getUsername();
        // JWT 생성
        final String jwtToken = jwtUtil.generateToken(userDetails, role, username);

        // JSON 형식으로 반환
        Map<String, String> response = new HashMap<>();
        response.put("token", jwtToken);

        logger.info("로그인 성공: {}", userDTO.getUsername()); // 로그인 성공 로그
        return ResponseEntity.ok(response); // JSON 형식으로 응답
    }

    // 토큰 리프레시 엔드포인트
    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> refreshToken(@RequestHeader("Authorization") String token) {
        logger.info("토큰 리프레시 요청: {}", token.substring(7)); // 토큰 리프레시 요청 로그

        // 토큰에서 Bearer 부분 제거
        String jwt = token.substring(7);
        String username = jwtUtil.extractUsername(jwt);
        UserDetails userDetails = userService.loadUserByUsername(username);

        // 토큰이 유효한 경우 새로운 토큰 생성 및 반환
        if (jwtUtil.validateToken(jwt, userDetails)) {
            String newToken = jwtUtil.generateToken(userDetails, jwtUtil.extractRole(jwt),
                    jwtUtil.extractUsername(jwt));
            Map<String, String> response = new HashMap<>();
            response.put("token", newToken);

            logger.info("새로운 토큰 생성 성공: {}", username); // 새로운 토큰 생성 성공 로그
            return ResponseEntity.ok(response);
        } else {
            logger.error("토큰 리프레시 실패: 유효하지 않은 토큰 - {}", username); // 토큰 리프레시 실패 로그
            return ResponseEntity.status(401).body(null);
        }
    }

    // 사용자 정보 수정 엔드포인트
    @PutMapping("/update/{userId}")
    public ResponseEntity<String> updateUser(
            @PathVariable("userId") Long userId,
            @RequestParam("email") String email,
            @RequestParam("currentPassword") String currentPassword,
            @RequestParam("newPassword") String newPassword,
            @RequestParam("phoneNum") String phoneNum) {

        logger.info("사용자 정보 수정 요청: userId={}", userId); // 사용자 정보 수정 요청 로그
        // 사용자 정보 업데이트 결과 반환
        String result = userService.updateUserInfo(userId, email, currentPassword, newPassword, phoneNum);

        logger.info("사용자 정보 수정 완료: userId={}", userId); // 사용자 정보 수정 완료 로그
        return ResponseEntity.ok(result);
    }

}
