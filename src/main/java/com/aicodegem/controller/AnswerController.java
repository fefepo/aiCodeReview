package com.aicodegem.controller;

import com.aicodegem.model.Answer;
import com.aicodegem.service.AnswerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/board/{boardId}/answers")
public class AnswerController {

    @Autowired
    private AnswerService answerService;

    @GetMapping
    public ResponseEntity<List<Answer>> getAnswers(@PathVariable Long boardId) {
        List<Answer> answers = answerService.getAnswersByBoardId(boardId);
        return ResponseEntity.ok(answers);
    }

    @PostMapping
    public ResponseEntity<Answer> addAnswer(@PathVariable Long boardId, @RequestBody Answer answer) {
        Answer saved = answerService.saveAnswer(boardId, answer);
        return ResponseEntity.ok(saved);
    }
}
