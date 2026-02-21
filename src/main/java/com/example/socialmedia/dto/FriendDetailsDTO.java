package com.example.socialmedia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FriendDetailsDTO {
    private String username;
    private String objectId;
    private boolean requestSent;

    // Additional constructor for when requestSent is not needed
    public FriendDetailsDTO(String username, String objectId) {
        this.username = username;
        this.objectId = objectId;
        this.requestSent = false;  // Default value
    }
}
