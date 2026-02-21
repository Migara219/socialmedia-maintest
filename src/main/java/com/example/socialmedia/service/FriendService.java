package com.example.socialmedia.service;

import com.example.socialmedia.dto.FriendDetailsDTO;
import com.example.socialmedia.entity.BaseFile;
import com.example.socialmedia.entity.UserInfo;
import com.example.socialmedia.repository.UserInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class FriendService extends BaseFile {

    @Autowired
    private UserInfoRepository userInfoRepository;

    @Autowired
    private UserInfoService userInfoService;

    public List<FriendDetailsDTO> getRegisteredUsers() {
        UserInfo currentUser = userInfoService.getLoggedInUser();
        Set<String> friendIds = currentUser.getFriends();
        
        return userInfoRepository.findAll().stream()
            .filter(user -> !user.getId().equals(currentUser.getId())) // Exclude current user
            .filter(user -> !friendIds.contains(user.getId())) // Exclude friends
            .map(user -> {
                boolean requestSent = user.getFriendsRequest().contains(currentUser.getId());
                return new FriendDetailsDTO(user.getUsername(), user.getId(), requestSent);
            })
            .collect(Collectors.toList());
    }

    public String sendFriendRequest(String toUserId) {
        String fromUserId = loggedUserId();

        if (toUserId == null || fromUserId == null) {
            throw new IllegalArgumentException("User IDs cannot be null");
        }

        // Get both users
        UserInfo fromUser = userInfoRepository.findById(fromUserId)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
        UserInfo toUser = userInfoRepository.findById(toUserId)
                .orElseThrow(() -> new RuntimeException("Target user not found"));

        // Check if request already exists
        if (toUser.getFriendsRequest().contains(fromUserId)) {
            return "Friend request already sent";
        }

        // Add request to recipient's friendsRequest set
        toUser.getFriendsRequest().add(fromUserId);
        userInfoRepository.save(toUser);

        return "Friend request sent successfully";
    }

    public String acceptFriendRequest(String fromUserId) {
        UserInfo user = loggerUser();
        UserInfo fromUser = userInfoRepository.findById(fromUserId)
                .orElseThrow(() -> new RuntimeException("Requested user not found"));

        if (!user.getFriendsRequest().contains(fromUserId)) {
            return "No such friend request!!!!";
        }

        // Update the users details
        user.getFriendsRequest().remove(fromUserId);
        user.getFriends().add(fromUserId);
        fromUser.getFriends().add(user.getId());

        // Update database
        userInfoRepository.save(user);
        userInfoRepository.save(fromUser);

        return "Friend requested accepted!!!";
    }

    public Set<String> getFriendRequests() {
        UserInfo user = loggerUser();
        return user.getFriendsRequest();
    }

    /*
     * public Set<String> getFriends() {
     * UserInfo user = loggerUser();
     * return user.getFriends();
     * }
     */

    public List<FriendDetailsDTO> getMyFriends() {
        UserInfo user = loggerUser();
        return user.getFriends().stream()
                .map(friendId -> userInfoRepository.findById(friendId)
                        .map(friend -> new FriendDetailsDTO(
                                friend.getUsername(),
                                friend.getId(),
                                false // For existing friends, requestSent is always false
                        ))
                        .orElse(null))
                .filter(friend -> friend != null)
                .collect(Collectors.toList());
    }
}
