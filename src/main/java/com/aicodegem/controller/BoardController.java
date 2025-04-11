package com.aicodegem.controller;

import com.aicodegem.model.Board;
import com.aicodegem.security.JwtUtil;
import com.aicodegem.service.BoardService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/board")
public class BoardController {

    private static final Logger logger = LoggerFactory.getLogger(BoardController.class);

    @Autowired
    private BoardService boardService;

    @Autowired
    private JwtUtil jwtUtil;

    // 전체 게시글 조회
    @GetMapping("/list")
    public ResponseEntity<List<Board>> getAllBoards() {
        logger.info("getAllBoards 호출됨");
        List<Board> boards = boardService.getAllBoardsSorted(); // 최신순으로 바꿈
        return ResponseEntity.ok(boards);
    }

    // 게시글 작성
    @PostMapping("/write")
    public ResponseEntity<Board> createBoard(@RequestBody Board board, HttpServletRequest request) {
        logger.info("createBoard 호출됨 - 제목: {}", board.getTitle());

        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.replace("Bearer ", "");
            String username = jwtUtil.extractUsername(token);
            board.setWriter(username);
        }

        Board saved = boardService.saveBoard(board);
        return ResponseEntity.ok(saved);
    }

    // 게시글 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<Board> getBoardById(@PathVariable Long id) {
        logger.info("getBoardById 호출됨 - ID: {}", id);
        Board board = boardService.getBoardById(id);

        if (board == null) {
            logger.warn("게시글 ID {} 를 찾을 수 없습니다.", id);
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(board);
    }
}
