package com.example.socialmedia.controller;

import com.example.socialmedia.dto.AuthRequest;
import com.example.socialmedia.dto.AuthResponse;
import com.example.socialmedia.dto.SignUpDTO;
import com.example.socialmedia.entity.UserInfo;
import com.example.socialmedia.service.JwtService;
import com.example.socialmedia.service.UserInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173/")
@RestController
@RequestMapping("/auth")
public class UserController {

    @Autowired
    private UserInfoService userInfoService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @GetMapping("/welcome")
    public String welcome() {
        return "Welcome this end point not protected";
    }

    @PostMapping("/signup")
    @ResponseBody
    public ResponseEntity<String> signUp(@RequestBody SignUpDTO signUpDTO) {
        try {
            String result = userInfoService.registerNewUser(signUpDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (RuntimeException e) {
            // Handle specific errors like username or email already exists
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        } catch (Exception e) {
            // Catch other unexpected errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }
    }

    @GetMapping("/user/profile")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public String userProfile() {
        return "Welcome to userProfile";
    }

    @GetMapping("/user/Admin")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public String adminProfile() {
        return "Welcome to Admin Profile";
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authRequest.getUsername(),
                            authRequest.getPassword()));

            if (authentication.isAuthenticated()) {
                String accessToken = jwtService.generateAccessToken(authRequest.getUsername());
                String refreshToken = jwtService.generateRefreshToken(authRequest.getUsername());
                AuthResponse response = new AuthResponse(
                        accessToken,
                        refreshToken,
                        authRequest.getUsername(),
                        System.currentTimeMillis() + jwtService.getAccessTokenExpiration());
                return ResponseEntity.ok(response);
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid credentials");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error during authentication: " + e.getMessage());
        }
    }

    @PostMapping("/refresh")
    public AuthResponse refreshToken(@RequestHeader("Authorization") String refreshToken) {
        if (refreshToken != null && refreshToken.startsWith("Bearer ")) {
            String token = refreshToken.substring(7);
            if (!jwtService.isTokenExpired(token)) {
                String username = jwtService.extractUsername(token);
                String newAccessToken = jwtService.generateAccessToken(username);
                return new AuthResponse(
                        newAccessToken,
                        refreshToken,
                        username,
                        System.currentTimeMillis() + jwtService.getAccessTokenExpiration());
            }
        }
        throw new RuntimeException("Invalid refresh token");
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile() {
        try {
            UserInfo user = userInfoService.getLoggedInUser();
            Map<String, Object> profileData = new HashMap<>();
            profileData.put("username", user.getUsername());
            profileData.put("friendsCount", user.getFriends().size());
            profileData.put("createdAt", user.getCreatedAt());

            return ResponseEntity.ok(profileData);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching profile data: " + e.getMessage());
        }
    }
}
