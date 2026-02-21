package com.example.socialmedia.dto;

import lombok.Data;

@Data
public class FriendRequestDTO {

    private String userId;

    public FriendRequestDTO() {}

    public FriendRequestDTO(String userId) {
        this.userId = userId;
    }
}
