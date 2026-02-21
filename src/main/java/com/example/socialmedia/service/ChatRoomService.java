package com.example.socialmedia.service;

import com.example.socialmedia.entity.ChatMessage;
import com.example.socialmedia.entity.ChatRoom;
import com.example.socialmedia.repository.ChatMessageRepository;
import com.example.socialmedia.repository.ChatRoomRepository; // Import ChatRoomRepository
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ChatRoomService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private ChatRoomRepository chatRoomRepository;  // Inject the ChatRoomRepository

    public List<ChatMessage> getChatHistory(String user1, String user2) {
        return chatMessageRepository.findBySenderIdAndReceiverId(user1, user2);
    }

    public void saveMessage(ChatMessage message) {
        chatMessageRepository.save(message);
    }

    public Optional<ChatRoom> getChatRoomById(String chatRoomId) {
        return chatRoomRepository.findById(chatRoomId);  // Use the injected repository
    }

    public void saveChatRoom(ChatRoom chatRoom) {
        chatRoomRepository.save(chatRoom);  // Save the chat room using the injected repository
    }
}
