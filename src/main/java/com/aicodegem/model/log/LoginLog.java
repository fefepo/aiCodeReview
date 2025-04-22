package com.aicodegem.model.log;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import com.aicodegem.model.User;

@Entity
@Table(name = "login_log")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "login_time", nullable = false)
    private LocalDateTime loginTime;
}
