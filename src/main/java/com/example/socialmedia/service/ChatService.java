package com.example.socialmedia.service;

import com.example.socialmedia.entity.BaseFile;
import com.example.socialmedia.entity.ChatMessage;
import com.example.socialmedia.entity.ChatRoom;
import com.example.socialmedia.repository.ChatRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class ChatService extends BaseFile {

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    public ChatRoom getOrCreateChatRoom(String user1Id) {
        String user2Id = loggedUserId();
        Optional<ChatRoom> chatRoom = chatRoomRepository.findByUser1IdAndUser2Id(user1Id, user2Id)
                .or(() -> chatRoomRepository.findByUser2IdAndUser1Id(user1Id, user2Id));

        return chatRoom.orElseGet(() -> {
            ChatRoom newRoom = new ChatRoom();
            newRoom.setUser1Id(user1Id);
            newRoom.setUser2Id(user2Id);
            return chatRoomRepository.save(newRoom);
        });
    }

    public ChatRoom createChatRoomIfNotExists(String user1Id) {
        String user2Id = loggedUserId();

        // Ensure the user IDs are ordered to avoid different chat room IDs for the same pair
        String firstUser = user1Id.compareTo(user2Id) < 0 ? user1Id : user2Id;
        String secondUser = user1Id.compareTo(user2Id) < 0 ? user2Id : user1Id;

        // Check if the chat room already exists
        Optional<ChatRoom> existingChatRoom = chatRoomRepository.findByUser1IdAndUser2Id(firstUser, secondUser);

        // If chat room doesn't exist, create and save a new one
        if (existingChatRoom.isEmpty()) {
            ChatRoom newChatRoom = new ChatRoom(firstUser, secondUser, null);
            return chatRoomRepository.save(newChatRoom);
        }

        // Return the existing chat room if it already exists
        return existingChatRoom.get();
    }


    public ChatRoom saveMessageToChatRoom(String chatRoomId, ChatMessage message) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new RuntimeException("Chat room not found"));

        if (chatRoom.getMessages() == null) {
            chatRoom.setMessages(new ArrayList<>());
        }

        chatRoom.getMessages().add(message);  // Add the new message to the list
        chatRoomRepository.save(chatRoom);    // Save the updated chat room with the new message

        return chatRoom;  // Return the updated chat room
    }
}
