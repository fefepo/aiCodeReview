package com.aicodegem.service;

import com.aicodegem.dto.ProblemRequestDTO;
import com.aicodegem.model.Problem;
import com.aicodegem.model.ProblemRequest;
import com.aicodegem.repository.ProblemRepository;
import com.aicodegem.repository.ProblemRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProblemService {
    private final ProblemRequestRepository problemRequestRepository;
    private final ProblemRepository problemRepository;

    public ProblemService(ProblemRequestRepository problemRequestRepository, ProblemRepository problemRepository) {
        this.problemRequestRepository = problemRequestRepository;
        this.problemRepository = problemRepository;
    }

    // 문제 요청 저장
    public ProblemRequest saveProblemRequest(ProblemRequestDTO dto) {
        ProblemRequest problemRequest = new ProblemRequest();
        problemRequest.setTitle(dto.getTitle());
        problemRequest.setContent(dto.getContent());
        problemRequest.setAnswer(dto.getAnswer());
        return problemRequestRepository.save(problemRequest);
    }

    // 요청된 문제 목록 조회
    public List<ProblemRequest> getAllProblemRequests() {
        return problemRequestRepository.findAll();
    }

    // 문제 요청 승인
    public Optional<Problem> approveProblemRequest(Long id) {
        Optional<ProblemRequest> optionalRequest = problemRequestRepository.findById(id);
        if (optionalRequest.isPresent()) {
            ProblemRequest request = optionalRequest.get();
            request.setStatus(ProblemRequest.Status.APPROVED);
            problemRequestRepository.save(request);

            Problem problem = new Problem();
            problem.setTitle(request.getTitle());
            problem.setContent(request.getContent());
            problem.setAnswer(request.getAnswer());
            return Optional.of(problemRepository.save(problem));
        }
        return Optional.empty();
    }

    // 문제 요청 거절
    public boolean rejectProblemRequest(Long id) {
        Optional<ProblemRequest> optionalRequest = problemRequestRepository.findById(id);
        if (optionalRequest.isPresent()) {
            ProblemRequest request = optionalRequest.get();
            request.setStatus(ProblemRequest.Status.REJECTED);
            problemRequestRepository.save(request);
            return true;
        }
        return false;
    }

    // 승인된 문제 목록 조회
    public List<Problem> getAllApprovedProblems() {
        return problemRepository.findAll();
    }
}
