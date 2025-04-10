package com.aicodegem.controller;

import com.aicodegem.model.Board;
import com.aicodegem.security.JwtUtil;
import com.aicodegem.service.BoardService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest; // 또는 javax.servlet.http.HttpServletRequest
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
        List<Board> boards = boardService.getAllBoards();

        if (boards.isEmpty()) {
            logger.warn("게시글이 없습니다.");
        }

        return ResponseEntity.ok(boards);
    }

    // 게시글 작성
    @PostMapping("/write")
    public ResponseEntity<Board> createBoard(@RequestBody Board board,
            HttpServletRequest request) {
        logger.info("createBoard 호출됨 - 제목: {}", board.getTitle());

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.replace("Bearer ", "");
            String username = jwtUtil.extractUsername(token); // ✅ 사용자명 추출
            board.setWriter(username); // ✅ 작성자 설정
        } else {
            logger.warn("Authorization 헤더 없음. 작성자 설정 실패");
        }

        Board saved = boardService.saveBoard(board);
        return ResponseEntity.ok(saved);
    }
}
