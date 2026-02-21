package com.example.socialmedia.repository;

import com.example.socialmedia.entity.UserInfo;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserInfoRepository extends MongoRepository<UserInfo, String> { // Assuming the ID type is String for MongoDB
    Optional<UserInfo> findByEmail(String email); // Use 'email' if that is the correct field for login
    Optional<UserInfo> findByUsername(String username); // find by username
    Optional<UserInfo> findById(String userId);
}