    package com.example.socialmedia.controller;

    import com.example.socialmedia.dto.ChatRoomRequestDTO;
    import com.example.socialmedia.entity.ChatMessage;
    import com.example.socialmedia.entity.ChatRoom;
    import com.example.socialmedia.repository.ChatMessageRepository;
    import com.example.socialmedia.service.ChatService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.web.bind.annotation.*;
    import java.time.LocalDateTime;

    @RestController
    @RequestMapping("/ws")
    public class ChatController {

        private final ChatMessageRepository chatMessageRepository;

        @Autowired
        private ChatService chatService;

        // Constructor injection for repository
        public ChatController(ChatMessageRepository chatMessageRepository) {
            this.chatMessageRepository = chatMessageRepository;
        }

        // Create or fetch a chat room for two users
        @PostMapping("/create")
        public ChatRoom createChatRoom(@RequestBody ChatRoomRequestDTO chatRoomRequest) {
            return chatService.createChatRoomIfNotExists(chatRoomRequest.getToUserID());
        }

        // Get or create a chat room for two users
        @PostMapping("/chatroom")
        public ChatRoom getOrCreateChatRoom(@RequestBody ChatRoomRequestDTO requestDTO) {
            return chatService.getOrCreateChatRoom(requestDTO.getToUserID());
        }

        @PostMapping("/send")
        public ChatMessage sendMessage(@RequestBody ChatMessage message, @RequestParam String chatRoomId) {
            System.out.println("\n\n\n"+"this method id run"+"\n\n\n");
            message.setChatRoomId(chatRoomId);
            message.setTimestamp(LocalDateTime.now()); // Ensure timestamp is set

            // Save the message in ChatMessage repository
            ChatMessage savedMessage = chatMessageRepository.save(message);

            // Save the message to the ChatRoom
            chatService.saveMessageToChatRoom(chatRoomId, savedMessage);

            return savedMessage;
        }

    }
