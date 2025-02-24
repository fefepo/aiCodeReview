package com.aicodegem.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import com.aicodegem.model.Ranking;
import com.aicodegem.model.User;
import com.aicodegem.repository.RankingRepository;
import com.aicodegem.repository.UserRepository;
import com.aicodegem.dto.UserDTO;

import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final RankingRepository rankingRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, RankingRepository rankingRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.rankingRepository = rankingRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        logger.info("사용자명 '{}'으로 유저 로딩을 시도합니다.", username);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    logger.error("사용자 '{}'을(를) 찾을 수 없습니다.", username);
                    return new UsernameNotFoundException("User not found with username: " + username);
                });
        logger.info("사용자 '{}'이(가) 성공적으로 로딩되었습니다.", username);

        // 사용자 엔티티의 role 값을 GrantedAuthority 리스트로 변환합니다.
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(user.getRole()));

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(), user.getPassword(), authorities);
    }

    // 사용자 역할을 가져오는 메서드
    public String getUserRole(String username) {
        logger.info("사용자명 '{}'의 역할을 조회합니다.", username);
        Optional<User> user = userRepository.findByUsername(username);
        String role = user.map(User::getRole).orElse("user");
        logger.info("사용자명 '{}'의 역할: {}", username, role);
        return role;
    }

    // 사용자 ID 조회 메서드
    public Long getUserId(String username) {
        logger.info("사용자명 '{}'의 ID를 조회합니다.", username);
        Optional<User> userOptional = userRepository.findByUsername(username);
        Long userId = userOptional.map(User::getId).orElse(null);
        if (userId == null) {
            logger.warn("사용자명 '{}'에 해당하는 ID가 없습니다.", username);
        } else {
            logger.info("사용자명 '{}'의 ID: {}", username, userId);
        }
        return userId;
    }

    // 유저 등록 로직 (Ranking 추가)
    public String registerUser(UserDTO userDTO) {
        logger.info("새 유저 등록 시도 - 사용자명: {}", userDTO.getUsername());
        if (userRepository.existsByUsername(userDTO.getUsername())) {
            logger.error("사용자명 '{}'이(가) 이미 사용 중입니다.", userDTO.getUsername());
            throw new IllegalStateException("Username already taken.");
        }

        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(userDTO.getPassword());

        // User 객체 생성
        User newUser = new User();
        newUser.setUsername(userDTO.getUsername());
        newUser.setPassword(encodedPassword);
        newUser.setEmail(userDTO.getEmail());
        newUser.setPhoneNum(userDTO.getPhoneNum());
        newUser.setRole("user"); // 기본 역할을 "user"로 설정

        // User 저장
        userRepository.save(newUser);
        logger.info("사용자 '{}'이(가) 성공적으로 등록되었습니다.", userDTO.getUsername());

        // Ranking 객체 생성 및 저장
        Ranking ranking = new Ranking();
        ranking.setUser(newUser); // User와 연결
        ranking.setUserRank(0); // 초기 순위 0
        ranking.setTotalScore(0); // 초기 점수 0
        ranking.setUpdateDate(LocalDate.now()); // 현재 날짜 설정

        rankingRepository.save(ranking);
        logger.info("사용자 '{}'의 Ranking이 성공적으로 등록되었습니다.", userDTO.getUsername());

        return "User and Ranking registered successfully";
    }

    // 사용자 개인정보 수정
    public String updateUserInfo(Long userId, String email, String currentPassword, String newPassword,
            String phoneNum) {
        logger.info("사용자 정보 수정 시도 - 사용자 ID: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.error("ID '{}'에 해당하는 사용자를 찾을 수 없습니다.", userId);
                    return new EntityNotFoundException("User not found with id: " + userId);
                });

        // 현재 비밀번호 확인 (비밀번호 인코딩을 고려한 비교)
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            logger.warn("현재 비밀번호가 잘못되었습니다 - 사용자 ID: {}", userId);
            return "현재 비밀번호가 잘못 되었습니다.";
        }

        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(newPassword)); // 새 비밀번호를 인코딩하여 저장
        user.setPhoneNum(phoneNum);
        userRepository.save(user);

        logger.info("사용자 정보가 성공적으로 변경되었습니다 - 사용자 ID: {}", userId);
        return "사용자 정보가 성공적으로 변경 되었습니다.";
    }
}
