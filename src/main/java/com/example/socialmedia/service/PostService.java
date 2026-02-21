package com.example.socialmedia.service;

import com.example.socialmedia.entity.BaseFile;
import com.example.socialmedia.entity.Comment;
import com.example.socialmedia.entity.Post;
import com.example.socialmedia.entity.UserInfo;
import com.example.socialmedia.repository.PostRepository;
import com.example.socialmedia.repository.UserInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PostService extends BaseFile {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserInfoRepository userInfoRepository;

    // Create a new post
    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    // Add a comment to a post
    public Post addCommentToPost(String postId, Comment comment) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        if (post.getComments() == null) {
            post.setComments(new ArrayList<>());
        }
        // Create a new Comment object using the provided comment text and postId
        Comment newComment = new Comment(comment.getComment(), postId);
        post.getComments().add(newComment);

        return postRepository.save(post);
    }

    public List<Post> getAllPostsByUsername(String username) {
        List<Post> allPosts = postRepository.findAll();
        return allPosts.stream()
                .filter(post -> isFriend(post.getUser()))
                .toList();
    }

    // Get post by ID
    public Optional<Post> getPostById(String id) {
        return postRepository.findById(id);
    }

    // Get post by user
    public List<Post> getPostByUser(String user) {
        return postRepository.findByUserOrderByCreatedAtDesc(user);
    }

    // Update post
    public Post updatePost(String id, Post postDetails) {
        Post post = postRepository.findById(id).orElseThrow();
        post.setContent(postDetails.getContent());
        post.setUser(postDetails.getUser());
        return postRepository.save(post);
    }

    public void deletePost(String id) {
        postRepository.deleteById(id);
    }

    public boolean isFriend(String postOwner) {
        UserInfo loggedInUser = loggerUser();
        Optional<UserInfo> postOwnerUser = userInfoRepository.findByUsername(postOwner);
        return postOwnerUser.map(user -> loggedInUser.getFriends().contains(user.getId())).orElse(false) ||
                postOwner.equals(loggedInUser.getUsername());
    }

    public List<Post> getPostsForFriends(String username) {
        List<Post> allPosts = postRepository.findAll();
        return allPosts.stream()
                .filter(post -> isFriend(post.getUser()))
                .toList();
    }

    // Get logged user posts
    public List<Post> getMyPosts() {
        String loggedUsername = loggedUsername(); // Get the logged-in username from BaseFile

        // Create query to find posts by logged user
        Query query = new Query();
        query.addCriteria(Criteria.where("user").is(loggedUsername));

        // Sort by createdAt in descending order (newest first)
        query.with(Sort.by(Sort.Direction.DESC, "createdAt"));

        return mongoTemplate.find(query, Post.class);
    }

    public boolean canViewPosts(String postOwner) {
        UserInfo loggedInUser = loggerUser();
        return isFriend(postOwner); // Use the `isFriend` method you already have.
    }

    public List<Post> getMyFeed() {
        String loggedInUsername = loggedUsername();

        // Retrieve all posts by friends and the logged-in user
        List<Post> posts = new ArrayList<>(postRepository.findAll().stream()
                .filter(post -> post.getUser().equals(loggedInUsername) || isFriend(post.getUser()))
                .toList());

        // Sort posts by the most recent activity (comments or updates)
        posts.sort((p1, p2) -> {
            LocalDateTime lastActivity1 = getLastActivityTime(p1);
            LocalDateTime lastActivity2 = getLastActivityTime(p2);
            return lastActivity2.compareTo(lastActivity1); // Descending order
        });

        return posts;
    }

    private LocalDateTime getLastActivityTime(Post post) {
        LocalDateTime lastCommentTime = post.getComments() != null && !post.getComments().isEmpty()
                ? post.getComments().stream()
                        .map(Comment::getCommentAt)
                        .max(LocalDateTime::compareTo)
                        .orElse(post.getCreatedAt())
                : post.getCreatedAt();

        // Use the later of the last comment time or the post creation time
        return lastCommentTime.isAfter(post.getCreatedAt()) ? lastCommentTime : post.getCreatedAt();
    }

}