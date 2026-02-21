package com.example.socialmedia.handler;

import com.example.socialmedia.entity.ChatMessage;
import com.example.socialmedia.repository.ChatMessageRepository;
import com.example.socialmedia.service.ChatRoomService;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDateTime;

@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {

    private final ChatRoomService chatRoomService;
    private final ChatMessageRepository chatMessageRepository;  // Inject the repository
    private final ObjectMapper objectMapper;


    // Updated constructor to inject both service and repository
    public ChatWebSocketHandler(ChatRoomService chatRoomService, ChatMessageRepository chatMessageRepository, ObjectMapper objectMapper) {
        this.chatRoomService = chatRoomService;
        this.chatMessageRepository = chatMessageRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        ChatMessage chatMessage = objectMapper.readValue(message.getPayload(), ChatMessage.class);

        chatMessage.setTimestamp(LocalDateTime.now());  // Set timestamp
        ChatMessage savedMessage = chatMessageRepository.save(chatMessage);  // Save the message

        // Save the message to the chat room
        chatRoomService.getChatRoomById(chatMessage.getChatRoomId()).ifPresent(chatRoom -> {
            chatRoom.getMessages().add(savedMessage);
            chatRoomService.saveChatRoom(chatRoom);  // Save updated chat room with the new message

        });

    }
/*
    // This method saves all buffered messages to the database
    public void saveBufferedMessagesToDatabase() {
        for (ChatMessage chatMessage : bufferedMessages) {
            chatRoomService.saveMessage(chatMessage);  // Save message to the database
        }
        bufferedMessages.clear();  // Clear the buffer after saving
    }*/


}
