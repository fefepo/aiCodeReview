package com.aicodegem.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "login_record")
public class LoginRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "login_date", nullable = false)
    private LocalDate loginDate;

    public LoginRecord() {
    }

    public LoginRecord(User user, LocalDate loginDate) {
        this.user = user;
        this.loginDate = loginDate;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDate getLoginDate() {
        return loginDate;
    }

    public void setLoginDate(LocalDate loginDate) {
        this.loginDate = loginDate;
    }
}
