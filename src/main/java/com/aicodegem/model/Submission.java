package com.aicodegem.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    private String userId;
    private String code;
    private String language;
    private String status; // "Pending", "Success", "Failed"
    private String output; // 실행 결과 출력값
    private LocalDateTime submittedAt;
}
