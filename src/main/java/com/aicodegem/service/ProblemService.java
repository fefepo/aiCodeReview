package com.aicodegem.service;

import com.aicodegem.dto.ProblemRequestDto;
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

    // ✅ 문제 생성 (createdBy 추가됨)
    public Problem createProblem(ProblemRequestDto dto) {
        Problem problem = Problem.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .inputExamples(dto.getInputExamples())
                .outputExamples(dto.getOutputExamples())
                .constraints(dto.getConstraints())
                .createdBy(dto.getCreatedBy()) // 🔹 작성자 추가
                .status(ProblemStatus.PENDING) // 🔹 처음엔 무조건 PENDING
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
    public Optional<Problem> getProblemById(Long id) {
        return problemRepository.findById(id);
    }

    // ✅ 특정 문제 수정 (createdBy는 수정 불가)
    public Optional<Problem> updateProblem(Long id, ProblemRequestDto dto) {
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
            return problemRepository.save(problem);
        });
    }

    // ✅ 특정 문제 삭제
    public boolean deleteProblem(Long id) {
        if (problemRepository.existsById(id)) {
            problemRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // 문제 승인
    public Optional<Problem> approveProblem(Long id) {
        return problemRepository.findById(id).map(problem -> {
            problem.setStatus(ProblemStatus.APPROVED);
            return problemRepository.save(problem);
        });
    }

    // 문제 거절
    public Optional<Problem> rejectProblem(Long id) {
        return problemRepository.findById(id).map(problem -> {
            problem.setStatus(ProblemStatus.REJECTED);
            return problemRepository.save(problem);
        });
    }

}
