package com.aicodegem.controller;

import com.aicodegem.model.Answer;
import com.aicodegem.service.AnswerService;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AnswerController.class)
public class AnswerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AnswerService answerService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testAddAnswer() throws Exception {
        Answer mockAnswer = new Answer();
        mockAnswer.setAuthor("tester");
        mockAnswer.setContent("테스트 내용");

        when(answerService.saveAnswer(Mockito.eq(1L), any(Answer.class)))
                .thenReturn(mockAnswer);

        mockMvc.perform(post("/api/board/1/answers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(mockAnswer)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.author").value("tester"))
                .andExpect(jsonPath("$.content").value("테스트 내용"));
    }

    @Test
    public void testGetAnswers() throws Exception {
        Answer a = new Answer();
        a.setAuthor("철수");
        a.setContent("내용1");

        when(answerService.getAnswersByBoardId(1L)).thenReturn(List.of(a));

        mockMvc.perform(get("/api/board/1/answers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].author").value("철수"));
    }
}
