import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BiTime, BiComment, BiUser, BiSearch } from "react-icons/bi";
import { handleSessionExpired, checkAuthError } from "../utils/auth";
import "../styles/Feed.css";
import axiosInstance from "../utils/axiosConfig";

interface Comment {
  id: string | null;
  postId: string | null;
  comment: string;
  user: string;
  commentAt: number[];
}

interface Post {
  id: string;
  content: string;
  user: string;
  createdAt: number[];
  comments: Comment[] | null;
}

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  const [commentInput, setCommentInput] = useState<{ [key: string]: string }>(
    {}
  );
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const navigate = useNavigate();

  const filteredPosts = posts.filter(post =>
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateArray: number[]) => {
    const date = new Date(
      dateArray[0],
      dateArray[1] - 1,
      dateArray[2],
      dateArray[3],
      dateArray[4],
      dateArray[5]
    );
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleComments = (postId: string) => {
    setExpandedComments((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const handleCommentChange = (postId: string, value: string) => {
    setCommentInput((prev) => ({ ...prev, [postId]: value }));
  };

  const submitComment = async (postId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        handleSessionExpired(navigate);
        return;
      }

      await axiosInstance.post(`/api/posts/${postId}/comment`, {
        comment: commentInput[postId],
      });

      // Clear the input after submission
      setCommentInput((prev) => ({ ...prev, [postId]: "" }));
    } catch (err: any) {
      if (axios.isAxiosError(err) && !err.response) {
        setError("Backend server is offline. We'll be back soon!");
      } else if (!checkAuthError(err, navigate)) {
        setError("Failed to post comment. Please try again later.");
      }
    }
  };

  const fetchPostById = (postId: string) => {
    navigate(`/posts/postid/${postId}`);
  };

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          handleSessionExpired(navigate);
          return;
        }

        const response = await axiosInstance.get("/api/posts/myfeed");
        setPosts(response.data);
      } catch (err: any) {
        if (axios.isAxiosError(err) && !err.response) {
          setError("Backend server is offline. We'll be back soon!");
        } else if (!checkAuthError(err, navigate)) {
          setError("Failed to fetch feed posts. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [navigate]);

  if (loading) {
    return (
      <div className="feed-loading">
        <div className="loading-spinner"></div>
        <p>Loading feed...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feed-error">
        <BiUser className="error-icon" />
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="feed-container">
      <h2>My Feed</h2>
      <div className="search-container">
        <div className="search-wrapper">
          <BiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      {filteredPosts.length === 0 ? (
        <div className="no-posts">
          <BiUser className="no-posts-icon" />
          <p>No posts in your feed yet.</p>
        </div>
      ) : (
        <div className="posts-list">
          {filteredPosts.map((post) => (
            <div key={post.id} className="post-card">
              <div
                className="post-header"
                onClick={() => fetchPostById(post.id)}
              >
                <div className="user-info">
                  <div className="user-avatar">
                    {post.user[0].toUpperCase()}
                  </div>
                  <span className="username">{post.user}</span>
                </div>
                <span className="post-date">
                  <BiTime /> {formatDate(post.createdAt)}
                </span>
              </div>
              <div className="post-content">{post.content}</div>
              <div className="post-footer">
                <button
                  className="comments-toggle"
                  onClick={() => toggleComments(post.id)}
                >
                  <BiComment />
                  <span>{post.comments?.length || 0} Comments</span>
                </button>
              </div>
              {expandedComments.includes(post.id) && (
                <div className="post-comments">
                  {post.comments &&
                    post.comments.map((comment, index) => (
                      <div key={index} className="comment">
                        <div className="comment-header">
                          <div className="comment-user">
                            <div className="user-avatar small">
                              {comment.user[0].toUpperCase()}
                            </div>
                            <span className="username">{comment.user}</span>
                          </div>
                          <span className="comment-date">
                            <BiTime /> {formatDate(comment.commentAt)}
                          </span>
                        </div>
                        <div className="comment-content">{comment.comment}</div>
                      </div>
                    ))}
                  {/* Always show the comment input field */}
                  <div className="comment-input">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentInput[post.id] || ""}
                      onChange={(e) =>
                        handleCommentChange(post.id, e.target.value)
                      }
                      className="comment-input-field"
                    />
                    <button
                      onClick={() => submitComment(post.id)}
                      className="comment-submit-button"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}
              {selectedPostId === post.id && (
                <div className="selected-post-details">
                  <h3>Post Details:</h3>
                  <p>{post.content}</p>
                  <h4>Comments:</h4>
                  {post.comments && post.comments.length > 0 ? (
                    post.comments.map((comment, index) => (
                      <div key={index} className="comment">
                        <strong>{comment.user}:</strong> {comment.comment}
                      </div>
                    ))
                  ) : (
                    <p>No comments yet.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;
