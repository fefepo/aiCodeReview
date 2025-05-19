package com.aicodegem.service;

import com.aicodegem.dto.ProblemRequestDTO;
import com.aicodegem.model.Problem;
import com.aicodegem.model.ProblemStatus;
import com.aicodegem.repository.ProblemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProblemService {
    private final ProblemRepository problemRepository;

    // ✅ 문제 생성 (createdBy, option 추가됨)
    public Problem createProblem(ProblemRequestDTO dto) {
        Problem problem = Problem.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .inputExamples(dto.getInputExamples())
                .outputExamples(dto.getOutputExamples())
                .constraints(dto.getConstraints())
                .createdBy(dto.getCreatedBy()) // 🔹 작성자 추가
                .option(dto.getOption()) // 🔹 문제 유형 추가
                .status(ProblemStatus.PENDING) // 🔹 처음엔 무조건 PENDING
                .rule(dto.getRule()) // 🔹 규칙 제목 저장
                .build();
        return problemRepository.save(problem);
    }

    // ✅ 모든 문제 가져오기
    public List<Problem> getAllProblems() {
        return problemRepository.findAll();
    }

    // ✅ 승인된 문제 가져오기
    public List<Problem> getApprovedProblems() {
        return problemRepository.findByStatus(ProblemStatus.APPROVED);
    }

    // ✅ 특정 문제 가져오기
    public Optional<Problem> getProblemById(String id) {
        return problemRepository.findById(id);
    }

    // ✅ 특정 문제 수정 (createdBy는 수정 불가, option 수정 가능)
    public Optional<Problem> updateProblem(String id, ProblemRequestDTO dto) {
        return problemRepository.findById(id).map(problem -> {
            if (dto.getTitle() != null) {
                problem.setTitle(dto.getTitle());
            }
            if (dto.getDescription() != null) {
                problem.setDescription(dto.getDescription());
            }
            if (dto.getInputExamples() != null) {
                problem.setInputExamples(dto.getInputExamples());
            }
            if (dto.getOutputExamples() != null) {
                problem.setOutputExamples(dto.getOutputExamples());
            }
            if (dto.getConstraints() != null) {
                problem.setConstraints(dto.getConstraints());
            }
            if (dto.getOption() != null) {
                problem.setOption(dto.getOption());
            }
            if (dto.getRule() != null) {
                problem.setRule(dto.getRule()); // 규칙 제목 수정
            }
            return problemRepository.save(problem);
        });
    }

    // ✅ 특정 문제 삭제
    public boolean deleteProblem(String id) {
        if (problemRepository.existsById(id)) {
            problemRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // 문제 승인
    public Optional<Problem> approveProblem(String id) {
        return problemRepository.findById(id).map(problem -> {
            problem.setStatus(ProblemStatus.APPROVED);
            return problemRepository.save(problem);
        });
    }

    // 문제 거절
    public Optional<Problem> rejectProblem(String id) {
        return problemRepository.findById(id).map(problem -> {
            problem.setStatus(ProblemStatus.REJECTED);
            return problemRepository.save(problem);
        });
    }
}