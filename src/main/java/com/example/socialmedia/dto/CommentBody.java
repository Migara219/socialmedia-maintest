package com.example.socialmedia.dto;

import lombok.Data;

@Data
public class CommentBody {
    private String comment;

    // Default constructor is provided by Lombok's @Data annotation
    public CommentBody() {
    }

    public CommentBody(String comment) {
        this.comment = comment;
    }
}
