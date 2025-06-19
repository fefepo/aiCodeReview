package com.aicodegem.repository;

import com.aicodegem.model.Answer;
import com.aicodegem.model.Board;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnswerRepository extends JpaRepository<Answer, Long> {
    // 특정 게시판(Board)에 속한 모든 답변 조회
    List<Answer> findByBoard(Board board);

    // 특정 게시판 ID(boardId)에 속한 답변을 작성일(createdAt) 내림차순 정렬하여 조회
    List<Answer> findByBoardIdOrderByCreatedAtDesc(Long boardId);
}
