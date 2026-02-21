package com.example.socialmedia.dto;

import com.example.socialmedia.entity.BaseFile;

public class ChatRoomRequestDTO extends BaseFile {
    private String toUserID;

    public ChatRoomRequestDTO() {}
    public ChatRoomRequestDTO(String toUserID) {
        this.toUserID = toUserID;
    }

    public String getToUserID() {
        return toUserID;
    }

}
