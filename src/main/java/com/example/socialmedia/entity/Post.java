package com.example.socialmedia.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "posts")
public class Post extends BaseFile {

    @Id
    private String id;
    private String content;
    private String user;
    private LocalDateTime createdAt;
    private List<Comment> comments; // Initialize the list;

    public Post(String content) {
        this.content = content;
        this.user = loggedUsername();
        this.createdAt = LocalDateTime.now();
    }

}