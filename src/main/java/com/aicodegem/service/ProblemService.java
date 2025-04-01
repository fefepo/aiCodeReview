package com.aicodegem.service;

import com.aicodegem.dto.ProblemRequestDto;
import com.aicodegem.model.Problem;
import com.aicodegem.repository.ProblemRepository;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProblemService {
    private final ProblemRepository problemRepository;

    // ✅ 문제 생성
    public Problem createProblem(ProblemRequestDto dto) {
        Problem problem = Problem.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .inputExample(dto.getInputExample())
                .outputExample(dto.getOutputExample())
                .constraints(dto.getConstraints())
                .build();
        return problemRepository.save(problem);
    }

    // ✅ 모든 문제 가져오기
    public List<Problem> getAllProblems() {
        return problemRepository.findAll();
    }

    // ✅ 특정 문제 가져오기
    public Optional<Problem> getProblemById(Long id) {
        return problemRepository.findById(id);
    }

    // ✅ 특정 문제 수정
    public Optional<Problem> updateProblem(Long id, Problem updatedProblem) {
        return problemRepository.findById(id).map(problem -> {
            // 수정할 값이 있는 경우에만 변경
            if (updatedProblem.getTitle() != null) {
                problem.setTitle(updatedProblem.getTitle());
            }
            if (updatedProblem.getDescription() != null) {
                problem.setDescription(updatedProblem.getDescription());
            }
            if (updatedProblem.getInputExample() != null) {
                problem.setInputExample(updatedProblem.getInputExample());
            }
            if (updatedProblem.getOutputExample() != null) {
                problem.setOutputExample(updatedProblem.getOutputExample());
            }
            if (updatedProblem.getConstraints() != null) {
                problem.setConstraints(updatedProblem.getConstraints());
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
        return false; // 문제 없음
    }
}
