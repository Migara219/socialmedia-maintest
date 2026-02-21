package com.example.socialmedia.service;

import com.example.socialmedia.entity.Comment;
import com.example.socialmedia.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    // Create a comment
    public Comment createComment(Comment comment) {
        return commentRepository.save(comment);
    }

    public Comment createComment(String content, String postId) {
        Comment comment = new Comment(content, postId);
        return commentRepository.save(comment);
    }
}
