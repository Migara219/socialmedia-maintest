package com.example.socialmedia.repository;

import com.example.socialmedia.entity.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByUser(String user);
}
