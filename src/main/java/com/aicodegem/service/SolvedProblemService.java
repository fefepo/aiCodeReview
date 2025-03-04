package com.aicodegem.service;

import com.aicodegem.model.SolvedProblem;
import com.aicodegem.repository.SolvedProblemRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SolvedProblemService {
    private final SolvedProblemRepository solvedProblemRepository;

    public SolvedProblemService(SolvedProblemRepository solvedProblemRepository) {
        this.solvedProblemRepository = solvedProblemRepository;
    }

    public List<SolvedProblem> getSolvedProblemsByUserId(Long userId) {
        return solvedProblemRepository.findByUserId(userId);
    }
}