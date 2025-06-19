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
    private Long id; // 게시판 글의 고유 ID (Primary Key)

    private String title; // 글 제목
    private String category; // 글 카테고리
    private String problemId; // 연관된 문제 ID (예: 문제 번호)

    @Column(columnDefinition = "TEXT")
    private String content; // 글 내용 (텍스트 제한 없음)

    private String language; // 사용 언어 (예: 프로그래밍 언어)
    private String writer; // 작성자 이름 또는 아이디

    private LocalDateTime createdAt; // 작성 일시
}
