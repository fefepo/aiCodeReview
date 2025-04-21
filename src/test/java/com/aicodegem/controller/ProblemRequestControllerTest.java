// package com.aicodegem.controller;

// import com.aicodegem.dto.ProblemRequestDTO;
// import com.aicodegem.model.ProblemRequest;
// import com.aicodegem.model.Status;
// import com.aicodegem.service.ProblemRequestService;
// import com.fasterxml.jackson.databind.ObjectMapper;
// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.extension.ExtendWith;
// import org.mockito.Mockito;
// import
// org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
// import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.http.MediaType;
// import org.springframework.test.context.junit.jupiter.SpringExtension;
// import org.springframework.test.web.servlet.MockMvc;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.mock.mockito.MockBean;
// import org.springframework.security.test.context.support.WithMockUser;

// import static
// org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
// import static
// org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
// import static org.mockito.ArgumentMatchers.any;
// import static org.mockito.ArgumentMatchers.anyLong;

// @ExtendWith(SpringExtension.class)
// @SpringBootTest
// @AutoConfigureMockMvc
// public class ProblemRequestControllerTest {

// @Autowired
// private MockMvc mockMvc;

// @MockBean
// private ProblemRequestService problemRequestService;

// private final ObjectMapper objectMapper = new ObjectMapper();

// @Test // 문제 추가 요청 생성
// @WithMockUser(username = "admin", roles = { "ADMIN" })
// public void testCreateRequest() throws Exception {
// ProblemRequestDTO requestDTO = new ProblemRequestDTO();
// requestDTO.setTitle("Test Title");
// requestDTO.setDescription("Test Description");

// // DTO에 tests 데이터도 추가 (클라이언트가 보내는 데이터 예시)
// ProblemRequestDTO.TestDTO testDTO = new ProblemRequestDTO.TestDTO();
// testDTO.setInput("3, 5");
// testDTO.setExpectedOutput("8");
// // 만약 여러 테스트 케이스가 필요하다면 List에 추가하세요.
// requestDTO.setTests(java.util.Collections.singletonList(testDTO));

// // 생성될 ProblemRequest 엔터티 객체 생성 및 테스트 케이스 추가
// ProblemRequest createdRequest = new ProblemRequest();
// createdRequest.setId(1L);
// createdRequest.setTitle("Test Title");
// createdRequest.setDescription("Test Description");
// createdRequest.setStatus(Status.PENDING);

// // ProblemTest 엔터티 객체 생성 (테스트 케이스)
// com.aicodegem.model.ProblemTest problemTest = new
// com.aicodegem.model.ProblemTest();
// problemTest.setInput("3, 5");
// problemTest.setExpectedOutput("8");
// // 양방향 연관관계 설정 (생성된 ProblemRequest를 참조)
// problemTest.setProblemRequest(createdRequest);

// // ProblemRequest에 테스트 케이스 목록 설정
// createdRequest.setTests(java.util.Collections.singletonList(problemTest));

// // 문제 요청 생성 시 Mock 서비스가 정상적인 응답을 반환하도록 설정
// Mockito.when(problemRequestService.createRequest(any(ProblemRequest.class)))
// .thenReturn(createdRequest);

// // API 요청 실행 및 결과 검증
// mockMvc.perform(post("/api/problems/request")
// .contentType(MediaType.APPLICATION_JSON)
// .content(objectMapper.writeValueAsString(requestDTO)))
// .andExpect(status().isCreated()) // 201 Created 응답 확인
// .andExpect(jsonPath("$.id").value(1L)) // 반환된 객체의 ID 확인
// .andExpect(jsonPath("$.title").value("Test Title")) // 제목 확인
// .andExpect(jsonPath("$.description").value("Test Description")) // 설명 확인
// .andExpect(jsonPath("$.status").value("PENDING")) // 상태 확인
// .andExpect(jsonPath("$.tests").isArray()) // tests 배열 확인
// .andExpect(jsonPath("$.tests[0].input").value("3, 5"))
// .andExpect(jsonPath("$.tests[0].expectedOutput").value("8"));
// }

// @Test // 문제 추가 요청 승인
// @WithMockUser(username = "admin", roles = { "ADMIN" })
// public void testApproveRequest_Success() throws Exception {
// ProblemRequest approvedRequest = new ProblemRequest();
// approvedRequest.setId(1L);
// approvedRequest.setTitle("Test Title");
// approvedRequest.setDescription("Test Description");
// approvedRequest.setStatus(Status.APPROVED);

// // 요청 승인 시 Mock 서비스가 승인된 요청을 반환하도록 설정
// Mockito.when(problemRequestService.approveRequest(1L)).thenReturn(approvedRequest);

// // API 요청 실행 및 결과 검증
// mockMvc.perform(put("/api/problems/approve/1")
// .contentType(MediaType.APPLICATION_JSON))
// .andExpect(status().isOk()) // 200 OK 응답 확인
// .andExpect(jsonPath("$.id").value(1L)) // 반환된 객체의 ID 확인
// .andExpect(jsonPath("$.status").value("APPROVED")); // 승인 상태 확인
// }

// }
