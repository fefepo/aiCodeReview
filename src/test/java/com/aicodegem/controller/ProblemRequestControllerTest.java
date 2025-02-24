package com.aicodegem.controller;

import com.aicodegem.dto.ProblemRequestDTO;
import com.aicodegem.model.ProblemRequest;
import com.aicodegem.model.Status;
import com.aicodegem.service.ProblemRequestService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
public class ProblemRequestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProblemRequestService problemRequestService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test // 문제 추가 요청 생성
    @WithMockUser(username = "admin", roles = { "ADMIN" })
    public void testCreateRequest() throws Exception {
        ProblemRequestDTO requestDTO = new ProblemRequestDTO();
        requestDTO.setTitle("Test Title");
        requestDTO.setDescription("Test Description");

        ProblemRequest createdRequest = new ProblemRequest();
        createdRequest.setId(1L);
        createdRequest.setTitle("Test Title");
        createdRequest.setDescription("Test Description");
        createdRequest.setStatus(Status.PENDING);

        // 문제 요청 생성 시 Mock 서비스가 정상적인 응답을 반환하도록 설정
        Mockito.when(problemRequestService.createRequest(any(ProblemRequest.class)))
                .thenReturn(createdRequest);

        // API 요청 실행 및 결과 검증
        mockMvc.perform(post("/api/problems/request")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isCreated()) // 201 Created 응답 확인
                .andExpect(jsonPath("$.id").value(1L)) // 반환된 객체의 ID 확인
                .andExpect(jsonPath("$.title").value("Test Title")) // 제목 확인
                .andExpect(jsonPath("$.description").value("Test Description")) // 설명 확인
                .andExpect(jsonPath("$.status").value("PENDING")); // 상태 확인
    }

    @Test // 문제 추가 요청 승인
    @WithMockUser(username = "admin", roles = { "ADMIN" })
    public void testApproveRequest_Success() throws Exception {
        ProblemRequest approvedRequest = new ProblemRequest();
        approvedRequest.setId(1L);
        approvedRequest.setTitle("Test Title");
        approvedRequest.setDescription("Test Description");
        approvedRequest.setStatus(Status.APPROVED);

        // 요청 승인 시 Mock 서비스가 승인된 요청을 반환하도록 설정
        Mockito.when(problemRequestService.approveRequest(1L)).thenReturn(approvedRequest);

        // API 요청 실행 및 결과 검증
        mockMvc.perform(put("/api/problems/approve/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()) // 200 OK 응답 확인
                .andExpect(jsonPath("$.id").value(1L)) // 반환된 객체의 ID 확인
                .andExpect(jsonPath("$.status").value("APPROVED")); // 승인 상태 확인
    }

}
