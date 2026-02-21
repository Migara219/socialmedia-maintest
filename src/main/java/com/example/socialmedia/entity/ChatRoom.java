package com.example.socialmedia.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "chatrooms")
public class ChatRoom {
    @Id
    private String id;

    @Indexed(unique = true) // Ensures uniqueness of chatroom based on user1Id and user2Id
    private String user1Id;

    @Indexed(unique = true) // Ensures uniqueness of chatroom based on user1Id and user2Id
    private String user2Id;

    private List<ChatMessage> messages = new ArrayList<>();

    public ChatRoom() {} // No argument constructor

    public ChatRoom(String user1Id, String user2Id, List<ChatMessage> messages) {
        this.user1Id = user1Id;
        this.user2Id = user2Id;
        this.messages = messages;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUser1Id() {
        return user1Id;
    }

    public void setUser1Id(String user1Id) {
        this.user1Id = user1Id;
    }

    public String getUser2Id() {
        return user2Id;
    }

    public void setUser2Id(String user2Id) {
        this.user2Id = user2Id;
    }

    public List<ChatMessage> getMessages() {
        return messages;
    }

    public void setMessages(List<ChatMessage> messages) {
        this.messages = messages;
    }
}
