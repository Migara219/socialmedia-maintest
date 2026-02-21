package com.example.socialmedia.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document
public class Comment extends BaseFile {
    @Id
    private String id;
    private String postId;
    private String comment;
    private String user;
    private LocalDateTime commentAt;

    public Comment(String comment, String postId) {
        this.postId = postId;
        this.comment = comment;
        this.user = loggedUsername();
        this.commentAt = LocalDateTime.now();
    }
}
