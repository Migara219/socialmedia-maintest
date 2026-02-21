//package com.example.socialmedia.scheduler;
//
//import com.example.socialmedia.handler.ChatWebSocketHandler;
//import org.springframework.scheduling.annotation.Scheduled;
//import org.springframework.stereotype.Component;
//
//@Component
//public class ChatMessageScheduler {
//
//    private final ChatWebSocketHandler chatWebSocketHandler;
//
//    public ChatMessageScheduler(ChatWebSocketHandler chatWebSocketHandler) {
//        this.chatWebSocketHandler = chatWebSocketHandler;
//    }
//
//    @Scheduled(fixedRate = 5000) // Save every 5 seconds
//    public void saveMessages() {
//        chatWebSocketHandler.saveBufferedMessagesToDatabase();  // Save buffered messages
//    }
//}
