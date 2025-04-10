package com.aicodegem.service;

import com.aicodegem.model.Board;
import com.aicodegem.repository.BoardRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BoardServiceImpl implements BoardService {

    private static final Logger logger = LoggerFactory.getLogger(BoardServiceImpl.class);

    @Autowired
    private BoardRepository boardRepository;

    @Override
    public List<Board> getAllBoards() {
        List<Board> boards = boardRepository.findAll();
        if (boards.isEmpty()) {
            logger.warn("게시글 목록이 비어 있습니다.");
        } else {
            logger.info("게시글 {}개 로드됨", boards.size());
        }
        return boards;
    }

    @Override
    public Board saveBoard(Board board) {
        board.setCreatedAt(LocalDateTime.now());
        Board saved = boardRepository.save(board);
        logger.info("게시글 저장 완료 - ID: {}", saved.getId());
        return saved;
    }

    @Override
    public Board getBoardById(Long id) {
        return boardRepository.findById(id).orElse(null);
    }
}
