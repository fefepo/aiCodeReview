package com.aicodegem.service;

import org.springframework.stereotype.Service;

@Service
public class WebSocketServiceImpl implements WebSocketService {
    @Override
    public String processMessage(String message) {
        return "Hello from Spring Boot! You said: " + message;
    }
}
