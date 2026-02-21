package com.example.socialmedia.config;

import com.example.socialmedia.handler.ChatWebSocketHandler;
import com.example.socialmedia.repository.ChatMessageRepository;
import com.example.socialmedia.service.ChatRoomService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final ChatRoomService chatRoomService;
    private final ChatMessageRepository chatMessageRepository;
    private final ObjectMapper objectMapper;

    public WebSocketConfig(ChatRoomService chatRoomService, ChatMessageRepository chatMessageRepository, ObjectMapper objectMapper) {
        this.chatRoomService = chatRoomService;
        this.chatMessageRepository = chatMessageRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new ChatWebSocketHandler(chatRoomService, chatMessageRepository, objectMapper), "/ws/chat")
                .setAllowedOrigins("*");
    }
}
