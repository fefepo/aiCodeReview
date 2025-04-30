package com.aicodegem.model.log;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import com.aicodegem.model.User;

@Entity
@Table(name = "signup_log")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SignupLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "signup_time", nullable = false)
    private LocalDateTime signupTime;
}
