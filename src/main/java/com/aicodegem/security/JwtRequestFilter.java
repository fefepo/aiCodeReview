package com.aicodegem.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import com.aicodegem.service.UserService;
import org.springframework.context.annotation.Lazy;
import org.springframework.beans.factory.annotation.Autowired;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtRequestFilter.class); // 로거 생성자

    private final UserService userService;
    private final JwtUtil jwtUtil;

    @Autowired
    public JwtRequestFilter(@Lazy UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException { // jwt 유효성 검사

        String jwt = extractJwtFromRequest(request); // jwt 토큰 추출

        if (jwt == null || jwt.isEmpty()) { // jwt 토큰이 빈 경우
            filterChain.doFilter(request, response);
            return;
        }

        String username = jwtUtil.extractUsername(jwt); // jwt 토큰에서 사용자 이름 추천

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userService.loadUserByUsername(username); // 사용자 이름으로 spring security에서 사용자
                                                                                     // 가져오기

            if (userDetails == null) {
                // `userDetails`가 null인 경우 인증을 설정하지 않고 종료
                logger.error("User not found: {}", username);
                filterChain.doFilter(request, response);
                return;
            }

            if (jwtUtil.validateToken(jwt, userDetails)) { // jwt 토큰 유효성 검사
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } else { // 유효하지 않은 토큰일 경우
                logger.warn("Invalid JWT token for user: {}", username);
            }
        }

        filterChain.doFilter(request, response);
    }

    private String extractJwtFromRequest(HttpServletRequest request) { // 프론트로 부터 가져온 토큰 parsing
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
