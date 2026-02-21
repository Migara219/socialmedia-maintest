package com.example.socialmedia.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;

import java.util.HashSet;
import java.util.Set;
import java.time.LocalDateTime;

@Document
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserInfo {

    @Id
    private String id;
    private String username;
    private String email;
    private String password;
    private String roles;

    // Friends and friend request
    private Set<String> friends = new HashSet<>(); // friends user IDs
    private Set<String> friendsRequest = new HashSet<>(); // friends request

    private LocalDateTime createdAt = LocalDateTime.now();

}
