package com.aicodegem.service.impl;

import com.aicodegem.model.Board;
import com.aicodegem.repository.BoardRepository;
import com.aicodegem.service.BoardService;

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

    // 모든 게시글 조회
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

    // 게시글 저장, 저장 시 작성일시 현재 시간으로 설정
    @Override
    public Board saveBoard(Board board) {
        board.setCreatedAt(LocalDateTime.now());
        Board saved = boardRepository.save(board);
        logger.info("게시글 저장 완료 - ID: {}", saved.getId());
        return saved;
    }

    // ID로 게시글 조회, 없으면 null 반환
    @Override
    public Board getBoardById(Long id) {
        return boardRepository.findById(id).orElse(null);
    }

    // 작성일시 내림차순으로 정렬된 모든 게시글 조회
    @Override
    public List<Board> getAllBoardsSorted() {
        List<Board> boards = boardRepository.findAllByOrderByCreatedAtDesc();
        logger.info("최신순으로 {}개 게시글 로드됨", boards.size());
        return boards;
    }
}
