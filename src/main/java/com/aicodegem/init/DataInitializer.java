package com.aicodegem.init;

import com.aicodegem.model.User;
import com.aicodegem.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // 관리자가 존재하지 않으면 생성 (username이 "admin"인 경우)
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            // 원하는 비밀번호("admin123")로 설정 (암호화 적용)
            admin.setPassword(passwordEncoder.encode("1234"));
            admin.setEmail("admin@naver.com");
            admin.setPhoneNum("010-0000-0000");
            // 역할은 Spring Security 기준으로 "ROLE_ADMIN" 형식으로 저장합니다.
            admin.setRole("ROLE_ADMIN");
            userRepository.save(admin);
            System.out.println("관리자 계정이 생성되었습니다.");
        }
    }
}