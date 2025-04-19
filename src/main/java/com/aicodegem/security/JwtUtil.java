package com.aicodegem.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import com.aicodegem.service.UserService;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtUtil {

        private final SecretKey SECRET_KEY;

        @Autowired
        private UserService userService;

        public JwtUtil(@Value("${jwt.secret}") String secret) {
                byte[] decodedKey = Base64.getDecoder().decode(secret);
                this.SECRET_KEY = new SecretKeySpec(decodedKey, 0, decodedKey.length, "HmacSHA256");
        }

        public String extractUsername(String token) {
                return extractClaim(token, Claims::getSubject); // subject = username
        }

        public String extractRole(String token) {
                return extractClaim(token, claims -> claims.get("role", String.class));
        }

        public Date extractExpiration(String token) {
                return extractClaim(token, Claims::getExpiration);
        }

        public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
                final Claims claims = extractAllClaims(token);
                return claimsResolver.apply(claims);
        }

        private Claims extractAllClaims(String token) {
                return Jwts.parserBuilder().setSigningKey(SECRET_KEY).build().parseClaimsJws(token).getBody();
        }

        private Boolean isTokenExpired(String token) {
                return extractExpiration(token).before(new Date());
        }

        public String generateToken(UserDetails userDetails, String role, String username) {
                Map<String, Object> claims = new HashMap<>();
                Long userId = userService.getUserId(username);

                claims.put("userId", String.valueOf(userId));
                claims.put("role", role);
                return createToken(claims, username); // username을 subject로 저장
        }

        private String createToken(Map<String, Object> claims, String subject) {
                return Jwts.builder()
                                .setClaims(claims)
                                .setSubject(subject) // subject에 username 저장
                                .setIssuedAt(new Date(System.currentTimeMillis()))
                                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
                                .signWith(SECRET_KEY)
                                .compact();
        }

        public Boolean validateToken(String token, UserDetails userDetails) {
                final String username = extractUsername(token);
                return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
        }
}
