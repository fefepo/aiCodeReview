package com.aicodegem.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

@RestController
public class WebSocketController {
    private static final Set<WebSocketSession> sessions = new CopyOnWriteArraySet<>();

    @GetMapping("/send-message")
    public String sendMessage(@RequestParam String message) {
        for (WebSocketSession session : sessions) {
            try {
                session.sendMessage(new TextMessage(message));
            } catch (Exception e) {
                return "Error: " + e.getMessage();
            }
        }
        return "Message sent!";
    }
}