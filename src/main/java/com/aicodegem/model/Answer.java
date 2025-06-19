package com.aicodegem.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "answer")
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 답변 ID (PK)

    private String author; // 답변 작성자

    @Column(columnDefinition = "TEXT")
    private String content; // 답변 내용 (길이 제한 없는 텍스트)

    private LocalDateTime createdAt; // 답변 작성일시

    @ManyToOne
    @JoinColumn(name = "board_id") // 답변이 속한 게시판의 ID (FK)
    private Board board;
}
