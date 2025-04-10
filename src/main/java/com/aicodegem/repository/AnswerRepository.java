package com.aicodegem.repository;

import com.aicodegem.model.Answer;
import com.aicodegem.model.Board;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnswerRepository extends JpaRepository<Answer, Long> {
    List<Answer> findByBoard(Board board);
}
