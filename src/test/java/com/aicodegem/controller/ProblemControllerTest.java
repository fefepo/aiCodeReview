package com.aicodegem.controller;

import com.aicodegem.config.TestSecurityConfig;
import com.aicodegem.dto.ProblemApprovalResponse;
import com.aicodegem.model.Problem;
import com.aicodegem.model.Problem.ProblemStatus;
import com.aicodegem.model.ProblemRequest;
import com.aicodegem.model.ProblemRequest.RequestStatus;
import com.aicodegem.security.JwtRequestFilter;
import com.aicodegem.security.JwtUtil;
import com.aicodegem.service.ProblemService;
import com.aicodegem.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProblemController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(TestSecurityConfig.class)
public class ProblemControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProblemService problemService;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private JwtRequestFilter jwtRequestFilter;

    @MockBean
    private UserService userService;

    @Test
    @DisplayName("문제 요청 API 테스트")
    public void testSubmitProblemRequest() throws Exception {
        // Given
        ProblemRequest request = new ProblemRequest();
        request.setTitle("전역 변수를 사용하지 마시오");
        request.setDescription("이문제는 전역 변수 피하는 거에요");
        request.setRequesterId("유저 id");
        request.setAttachedRuleIds(Arrays.asList("규칙id1", "규칙id2"));

        ProblemRequest savedRequest = new ProblemRequest();
        savedRequest.setId("67b7183d357e4d3eedcd4828");
        savedRequest.setTitle("전역 변수를 사용하지 마시오");
        savedRequest.setDescription("이문제는 전역 변수 피하는 거에요");
        savedRequest.setRequesterId("유저 id");
        savedRequest.setStatus(RequestStatus.PENDING);
        savedRequest.setAttachedRuleIds(Arrays.asList("규칙id1", "규칙id2"));
        savedRequest.setRequestDate(LocalDateTime.now());

        when(problemService.submitProblemRequest(any(ProblemRequest.class))).thenReturn(savedRequest);

        // When & Then
        mockMvc.perform(post("/api/problems/request")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("67b7183d357e4d3eedcd4828"))
                .andExpect(jsonPath("$.title").value("전역 변수를 사용하지 마시오"))
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    @DisplayName("문제 승인 API 테스트")
    public void testApproveProblemRequest() throws Exception {
        // Given
        String problemId = "67b7183d357e4d3eedcd4828";

        // AllArgsConstructor를 사용하여 객체 생성
        ProblemApprovalResponse response = new ProblemApprovalResponse(problemId, RequestStatus.APPROVED);

        when(problemService.approveProblemRequest(eq(problemId), eq(true))).thenReturn(response);

        // When & Then
        mockMvc.perform(post("/api/problems/approve/{requestId}", problemId)
                .param("isApproved", "true")
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.requestId").value(problemId))
                .andExpect(jsonPath("$.status").value("APPROVED"));
    }

    @Test
    @DisplayName("문제 상태 변경 API 테스트")
    public void testChangeProblemStatus() throws Exception {
        // Given
        String problemId = "67b7183d357e4d3eedcd4828";
        ProblemStatus newStatus = ProblemStatus.INACTIVE;

        // When & Then
        mockMvc.perform(patch("/api/problems/{problemId}/status", problemId)
                .param("status", newStatus.name())
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("모든 문제 목록 조회 API 테스트")
    public void testGetAllProblems() throws Exception {
        // Given
        Problem problem1 = new Problem();
        problem1.setId("65b719a4357e4d3eedcd4829");
        problem1.setTitle("Avoid global variables");
        problem1.setDescription("Global variables should be avoided.");
        problem1.setStatus(ProblemStatus.ACTIVE);
        problem1.setAttachedRuleIds(Arrays.asList("rule001", "rule002"));

        Problem problem2 = new Problem();
        problem2.setId("65b719a4357e4d3eedcd4830");
        problem2.setTitle("Use meaningful variable names");
        problem2.setDescription("Variables should have meaningful names.");
        problem2.setStatus(ProblemStatus.INACTIVE);
        problem2.setAttachedRuleIds(Arrays.asList("rule003"));

        List<Problem> problems = Arrays.asList(problem1, problem2);

        when(problemService.getAllProblems()).thenReturn(problems);

        // When & Then
        mockMvc.perform(get("/api/problems")
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("65b719a4357e4d3eedcd4829"))
                .andExpect(jsonPath("$[0].title").value("Avoid global variables"))
                .andExpect(jsonPath("$[0].status").value("ACTIVE"))
                .andExpect(jsonPath("$[1].id").value("65b719a4357e4d3eedcd4830"))
                .andExpect(jsonPath("$[1].title").value("Use meaningful variable names"))
                .andExpect(jsonPath("$[1].status").value("INACTIVE"));
    }

    @Test
    @DisplayName("특정 문제 조회 API 테스트")
    public void testGetProblemById() throws Exception {
        // Given
        String problemId = "65b719a4357e4d3eedcd4829";

        Problem problem = new Problem();
        problem.setId(problemId);
        problem.setTitle("Avoid global variables");
        problem.setDescription("Global variables should be avoided.");
        problem.setStatus(ProblemStatus.ACTIVE);
        problem.setAttachedRuleIds(Arrays.asList("rule001", "rule002"));

        when(problemService.getProblemById(problemId)).thenReturn(problem);

        // When & Then
        mockMvc.perform(get("/api/problems/{problemId}", problemId)
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(problemId))
                .andExpect(jsonPath("$.title").value("Avoid global variables"))
                .andExpect(jsonPath("$.status").value("ACTIVE"));
    }

    public void testSearchByTitle() throws Exception {
        // Given
        String title = "변수";
        int page = 1; // 컨트롤러에서는 1부터 시작하는 페이지 번호를 받음
        int size = 10;

        Problem problem1 = new Problem();
        problem1.setId("65b719a4357e4d3eedcd4829");
        problem1.setTitle("전역 변수를 사용하지 마시오");
        problem1.setDescription("전역 변수는 피해야 합니다.");
        problem1.setStatus(ProblemStatus.ACTIVE);

        Problem problem2 = new Problem();
        problem2.setId("65b719a4357e4d3eedcd4830");
        problem2.setTitle("의미있는 변수 이름 사용하기");
        problem2.setDescription("변수 이름은 의미가 있어야 합니다.");
        problem2.setStatus(ProblemStatus.ACTIVE);

        List<Problem> problems = Arrays.asList(problem1, problem2);
        Page<Problem> problemPage = new PageImpl<>(problems, PageRequest.of(page - 1, size), problems.size());

        when(problemService.searchByTitle(eq(title), any(Pageable.class))).thenReturn(problemPage);

        // When & Then
        mockMvc.perform(get("/api/problems/search")
                .param("title", title)
                .param("page", String.valueOf(page))
                .param("size", String.valueOf(size))
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(2))
                .andExpect(jsonPath("$.data[0].id").value("65b719a4357e4d3eedcd4829"))
                .andExpect(jsonPath("$.data[0].title").value("전역 변수를 사용하지 마시오"))
                .andExpect(jsonPath("$.data[1].id").value("65b719a4357e4d3eedcd4830"))
                .andExpect(jsonPath("$.data[1].title").value("의미있는 변수 이름 사용하기"))
                .andExpect(jsonPath("$.pageInfo").exists())
                .andExpect(jsonPath("$.pageInfo.page").value(page))
                .andExpect(jsonPath("$.pageInfo.size").value(size))
                .andExpect(jsonPath("$.pageInfo.totalElements").value(2))
                .andExpect(jsonPath("$.pageInfo.totalPages").value(1));
    }

    @Test
    @DisplayName("문제 요청 승인 테스트")
    public void testApproveProblemRequestWithReviewerId() throws Exception {
        // Given
        String requestId = "67b7183d357e4d3eedcd4828";
        String reviewerId = "admin123";

        ProblemRequest approvedRequest = new ProblemRequest();
        approvedRequest.setId(requestId);
        approvedRequest.setTitle("전역 변수를 사용하지 마시오");
        approvedRequest.setDescription("이문제는 전역 변수 피하는 거에요");
        approvedRequest.setRequesterId("유저 id");
        approvedRequest.setStatus(RequestStatus.APPROVED);

        // When & Then
        mockMvc.perform(post("/api/problems/request/{requestId}/approve", requestId)
                .param("reviewerId", reviewerId)
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(requestId))
                .andExpect(jsonPath("$.status").value("APPROVED"));
    }

    @Test
    @DisplayName("문제 요청 거부 테스트")
    public void testRejectProblemRequestWithReason() throws Exception {
        // Given
        String requestId = "67b7183d357e4d3eedcd4828";
        String reviewerId = "admin123";
        String reason = "규칙에 맞지 않는 문제입니다.";

        ProblemRequest rejectedRequest = new ProblemRequest();
        rejectedRequest.setId(requestId);
        rejectedRequest.setTitle("전역 변수를 사용하지 마시오");
        rejectedRequest.setDescription("이문제는 전역 변수 피하는 거에요");
        rejectedRequest.setRequesterId("유저 id");
        rejectedRequest.setStatus(RequestStatus.REJECTED);

        // When & Then
        mockMvc.perform(post("/api/problems/request/{requestId}/reject", requestId)
                .param("reviewerId", reviewerId)
                .param("reason", reason)
                .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(requestId))
                .andExpect(jsonPath("$.status").value("REJECTED"));
    }
}