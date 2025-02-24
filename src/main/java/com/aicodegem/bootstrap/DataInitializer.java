package com.aicodegem.bootstrap;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.aicodegem.repository.UserRepository;
import com.aicodegem.model.User;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // "admin" 계정이 없으면 생성
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("adminPassword"));
            admin.setRole("ROLE_ADMIN");
            // 이메일과 핸드폰 번호도 설정 (테스트용 더미 값)
            admin.setEmail("admin@example.com");
            admin.setPhoneNum("010-1234-5678");

            userRepository.save(admin);
            System.out.println("Admin account created for testing.");
        }
    }
}
