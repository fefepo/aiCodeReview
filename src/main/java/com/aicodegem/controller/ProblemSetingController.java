package com.aicodegem.controller;

import com.aicodegem.model.SolvedProblem;
import com.aicodegem.service.SolvedProblemService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class ProblemSetingController {
    private final SolvedProblemService solvedProblemService;

    public ProblemSetingController(SolvedProblemService solvedProblemService) {
        this.solvedProblemService = solvedProblemService;
    }

    @GetMapping("/{userId}/solved-problems")
    public List<SolvedProblem> getSolvedProblems(@PathVariable Long userId) {
        return solvedProblemService.getSolvedProblemsByUserId(userId);
    }
}
