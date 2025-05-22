package com.aicodegem.controller;

import com.aicodegem.model.Board;
import com.aicodegem.service.BoardService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
public class BoardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BoardService boardService;

    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    @Test
    public void testCreateBoard() throws Exception {
        Board request = new Board(null, "테스트 제목", "질문", "1001", "내용입니다.", "C++", "tester", null);
        Board saved = new Board(1L, "테스트 제목", "질문", "1001", "내용입니다.", "C++", "tester", LocalDateTime.now());

        Mockito.when(boardService.saveBoard(any(Board.class))).thenReturn(saved);

        mockMvc.perform(post("/api/board/write")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.title", is("테스트 제목")));
    }

    @Test
    public void testGetAllBoards() throws Exception {
        Board board1 = new Board(1L, "글1", "질문", "1001", "내용1", "Java", "aaa", LocalDateTime.now());
        Board board2 = new Board(2L, "글2", "자유", "1002", "내용2", "Python", "bbb", LocalDateTime.now());

        List<Board> boards = Arrays.asList(board1, board2);

        Mockito.when(boardService.getAllBoardsSorted()).thenReturn(boards);

        mockMvc.perform(get("/api/board/list")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].title", is("글1")))
                .andExpect(jsonPath("$[1].writer", is("bbb")));
    }

    @Test
    public void testGetBoardById() throws Exception {
        Board board = new Board(1L, "상세 글", "질문", "1003", "내용입니다", "Java", "tester", LocalDateTime.now());

        Mockito.when(boardService.getBoardById(1L)).thenReturn(board);

        mockMvc.perform(get("/api/board/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("상세 글")));
    }

}
