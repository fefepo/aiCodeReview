package com.aicodegem.controller;

import com.aicodegem.service.PylintService;
import com.aicodegem.service.PylintService.PylintResult;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/pylint")
public class PylintController {

    private final PylintService pylintService;

    public PylintController(PylintService pylintService) {
        this.pylintService = pylintService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeCode(@RequestBody Map<String, String> request) {
        String code = request.get("code");
        if (code == null || code.isEmpty()) {
            return ResponseEntity.badRequest().body("Code is required");
        }
        try {
            PylintResult result = pylintService.runPylint(code);
            Map<String, Object> response = new HashMap<>();
            response.put("score", result.getScore());
            response.put("output", result.getOutput());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Pylint 오류: " + e.getMessage());
        }
    }
}
