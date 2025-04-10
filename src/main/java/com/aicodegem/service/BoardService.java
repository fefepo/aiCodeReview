package com.aicodegem.service;

import com.aicodegem.model.Board;

import java.util.List;

public interface BoardService {
    List<Board> getAllBoards();

    List<Board> getAllBoardsSorted(); // 최신순 반환

    Board saveBoard(Board board);

    Board getBoardById(Long id);
}
