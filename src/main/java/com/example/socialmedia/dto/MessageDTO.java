package com.example.socialmedia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDateTime;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageDTO {

    private String senderId;  // ID of the sender
    private String receiverId;  // ID of the receiver
    private String message;
    private LocalDateTime timestamp;
}
