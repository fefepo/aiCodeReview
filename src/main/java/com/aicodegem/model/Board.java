package com.aicodegem.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "board")
public class Board {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String category;

    private String problemId;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String language;

    private String writer;

    private LocalDateTime createdAt;
}
