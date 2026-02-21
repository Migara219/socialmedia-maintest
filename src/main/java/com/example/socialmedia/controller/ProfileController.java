package com.example.socialmedia.controller;

import com.example.socialmedia.dto.PasswordChangeDTO;
import com.example.socialmedia.entity.UserInfo;
import com.example.socialmedia.service.UserInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173")
public class ProfileController {

    @Autowired
    private UserInfoService userInfoService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile() {
        try {
            UserInfo user = userInfoService.getLoggedInUser();
            Map<String, Object> profileData = new HashMap<>();
            profileData.put("username", user.getUsername());
            profileData.put("email", user.getEmail());
            profileData.put("roles", user.getRoles());
            profileData.put("friendsCount", user.getFriends().size());
            profileData.put("createdAt", user.getCreatedAt());

            return ResponseEntity.ok(profileData);
        } catch (Exception e) {
            e.printStackTrace(); // Add this for debugging
            return ResponseEntity.internalServerError()
                    .body("Error fetching profile data: " + e.getMessage());
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody PasswordChangeDTO passwordChangeDTO) {
        try {
            UserInfo user = userInfoService.getLoggedInUser();
            
            // Verify current password
            if (!passwordEncoder.matches(passwordChangeDTO.getCurrentPassword(), user.getPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Current password is incorrect");
            }
            
            // Update password
            user.setPassword(passwordEncoder.encode(passwordChangeDTO.getNewPassword()));
            userInfoService.updateUser(user);
            
            return ResponseEntity.ok("Password updated successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error changing password: " + e.getMessage());
        }
    }
} 