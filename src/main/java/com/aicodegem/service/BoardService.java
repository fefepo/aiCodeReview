package com.aicodegem.service;

import com.aicodegem.model.Board;

import java.util.List;

public interface BoardService {
    List<Board> getAllBoards();

    Board saveBoard(Board board);

    Board getBoardById(Long id);
}
