package com.aicodegem.service;

import com.aicodegem.model.Answer;
import com.aicodegem.model.Board;
import com.aicodegem.repository.AnswerRepository;
import com.aicodegem.repository.BoardRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AnswerServiceImpl implements AnswerService {

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private BoardRepository boardRepository;

    @Override
    public List<Answer> getAnswersByBoardId(Long boardId) {
        Board board = boardRepository.findById(boardId).orElse(null);
        return board != null ? answerRepository.findByBoard(board) : List.of();
    }

    @Override
    public Answer saveAnswer(Long boardId, Answer answer) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("Board not found"));
        answer.setBoard(board);
        answer.setCreatedAt(LocalDateTime.now());
        return answerRepository.save(answer);
    }
}
