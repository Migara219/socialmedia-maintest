package com.example.socialmedia.entity;

import com.example.socialmedia.repository.UserInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class BaseFile {

    @Autowired
    private UserInfoRepository userInfoRepository;

    protected String loggedUsername() {
        String username;
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Get username
        if (authentication != null && authentication.isAuthenticated()) {
            username = authentication.getName(); // This will return the username
        }
        else {
            username = null;
        }
        return username;
    }

    protected String loggedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String username = authentication.getName();
            return userInfoRepository.findByUsername(username)
                    .map(UserInfo::getId)
                    .orElse(null);
        }
        return null;
    }

    protected UserInfo loggerUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()) { // && authentication.getPrincipal() instanceof UserInfo
            // Return the CustomUserDetails object
            String username = authentication.getName();
            Optional<UserInfo> user = userInfoRepository.findByUsername(authentication.getName());
            return user.orElse(null);
        }

        // Return null if authentication or principal is invalid
        return null;
    }

    protected UserInfo getLoggedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if(authentication != null && authentication.isAuthenticated() &&
                authentication.getPrincipal() instanceof UserInfo) {
            System.out.println("\n\n\n\n"+"this line was runed!!"+"\n\n\n\n");
            UserInfo userInfo = (UserInfo) authentication.getPrincipal();
            return userInfo;
        }
        return null;
    }
}
