package com.aicodegem.handler;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.aicodegem.service.WebSocketService;

@Component
public class WebSocketHandler extends TextWebSocketHandler {
    private final WebSocketService webSocketService;

    public WebSocketHandler(WebSocketService webSocketService) {
        this.webSocketService = webSocketService;
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String receivedMessage = message.getPayload();
        System.out.println("Received: " + receivedMessage);

        // WebSocketService를 사용하여 메시지 처리
        String response = webSocketService.processMessage(receivedMessage);

        // 클라이언트에게 응답 전송
        session.sendMessage(new TextMessage(response));
    }
}
