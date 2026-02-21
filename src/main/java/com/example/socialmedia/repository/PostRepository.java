package com.example.socialmedia.repository;

import com.example.socialmedia.entity.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {
    List<Post> findByUserOrderByCreatedAtDesc(String username);
    List<Post> findByUser(String user);
}