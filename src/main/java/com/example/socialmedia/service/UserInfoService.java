package com.example.socialmedia.service;

import com.example.socialmedia.dto.FriendDetailsDTO;
import com.example.socialmedia.dto.SignUpDTO;
import com.example.socialmedia.entity.UserInfo;
import com.example.socialmedia.repository.UserInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserInfoService implements UserDetailsService {

    @Autowired
    private UserInfoRepository repository;

    @Autowired
    private PasswordEncoder encoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<UserInfo> userDetail = repository.findByUsername(username); // Assuming 'username' is used as username

        // Converting UserInfo to UserDetails
        return userDetail.map(UserInfoDetails::new)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    public String registerNewUser(SignUpDTO signUpDTO) {
        // Check if username already exists
        if (repository.findByUsername(signUpDTO.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        // Check if email already exists
        if (repository.findByEmail(signUpDTO.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        UserInfo userInfo = new UserInfo();
        userInfo.setUsername(signUpDTO.getUsername());
        userInfo.setPassword(encoder.encode(signUpDTO.getPassword()));
        userInfo.setEmail(signUpDTO.getEmail());
        userInfo.setRoles("ROLE_USER");

        repository.save(userInfo);
        return "User Added Successfully";
    }

    public FriendDetailsDTO getUserDetails(String userId) {
        return repository.findById(userId)
            .map(user -> new FriendDetailsDTO(
                user.getUsername(), 
                user.getId(),
                false  // requestSent is false by default
            ))
            .orElse(null);
    }

    public UserInfo getLoggedInUser() {
        // Get the username from the security context
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        
        // Find and return the user from the repository
        return repository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public void updateUser(UserInfo user) {
        repository.save(user);
    }
}