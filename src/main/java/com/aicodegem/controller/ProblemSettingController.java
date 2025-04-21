package com.aicodegem.controller;

import com.aicodegem.model.SolvedProblem;
import com.aicodegem.model.User;
import com.aicodegem.model.UserCodeStyle;
import com.aicodegem.service.SolvedProblemService;
import com.aicodegem.service.UserCodeStyleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class ProblemSettingController {
    private final SolvedProblemService solvedProblemService;
    private final UserCodeStyleService userCodeStyleService;

    public ProblemSettingController(SolvedProblemService solvedProblemService,
            UserCodeStyleService userCodeStyleService) {
        this.solvedProblemService = solvedProblemService;
        this.userCodeStyleService = userCodeStyleService;
    }

    @GetMapping("/{userId}/solved-problems")
    public List<SolvedProblem> getSolvedProblems(@PathVariable Long userId) {
        return solvedProblemService.getSolvedProblemsByUserId(userId);
    }

    @GetMapping("/{userId}/code-style")
    public Optional<UserCodeStyle> getUserCodeStyle(@PathVariable Long userId) {
        return userCodeStyleService.getUserCodeStyle(userId);
    }

    @PostMapping("/{userId}/code-style")
    public UserCodeStyle updateUserCodeStyle(@PathVariable Long userId, @RequestBody UserCodeStyle userCodeStyle) {
        userCodeStyle.setUser(new User(userId)); // 유저 ID 설정
        return userCodeStyleService.saveOrUpdateUserCodeStyle(userCodeStyle);
    }
}
