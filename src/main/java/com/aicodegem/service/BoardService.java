package com.aicodegem.service;

import com.aicodegem.model.Board;

import java.util.List;

public interface BoardService {

    // 모든 게시글 조회
    List<Board> getAllBoards();

    // 작성일 기준 최신순으로 게시글 조회
    List<Board> getAllBoardsSorted();

    // 게시글 저장
    Board saveBoard(Board board);

    // ID로 게시글 조회
    Board getBoardById(Long id);
}
