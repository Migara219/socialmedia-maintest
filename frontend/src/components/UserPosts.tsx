import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiTime, BiComment, BiUser } from "react-icons/bi";
import { BsPencilSquare } from "react-icons/bs";
import { handleSessionExpired, checkAuthError } from "../utils/auth";
import "../styles/UserPosts.css";
import "../styles/Feed.css"; // Import Feed.css for styles
import axiosInstance from "../utils/axiosConfig"; // Import axiosInstance
// Import icons from react-icons
import { FaRegComment, FaChevronDown, FaChevronUp } from "react-icons/fa";

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

const UserPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

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

  // Toggle comments visibility
  const toggleComments = (postId: string) => {
    setExpandedComments((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  // Filter posts based on search query
  const filteredPosts = posts.filter((post) =>
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token exists:", !!token);
        if (token) {
          console.log("Token format:", token.substring(0, 20) + "...");
        }

        if (!token) {
          handleSessionExpired(navigate);
          return;
        }

        const response = await axiosInstance.get("/api/posts/myposts");
        setPosts(response.data);
      } catch (err: any) {
        console.error("Error fetching posts:", err);
        if (!checkAuthError(err, navigate)) {
          setError(
            `Failed to fetch posts: ${
              err.response?.data?.message || err.message
            }`
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [navigate]);

  if (loading) {
    return (
      <div className="posts-loading">
        <div className="loading-spinner"></div>
        <p>Loading your posts...</p>
      </div>
    );
  }

  if (error) {
    return <div className="posts-error">{error}</div>;
  }

  return (
    <div className="posts-container">
      <div className="posts-header">
        <h2>Your Posts</h2>
        <button
          className="new-post-btn"
          onClick={() => {
            const token = localStorage.getItem("token");
            if (!token) {
              handleSessionExpired(navigate);
              return;
            }
            navigate("/posts/create");
          }}
        >
          <BsPencilSquare /> New Post
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <div className="search-wrapper">
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
          <p>You haven't created any posts yet.</p>
          <button className="create-post-btn">
            <BsPencilSquare /> Create Your First Post
          </button>
        </div>
      ) : (
        <div className="posts-list">
          {filteredPosts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-header">
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
                  <FaRegComment />
                  <span>{post.comments?.length || 0} Comments</span>
                  {expandedComments.includes(post.id) ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </button>
              </div>
              {expandedComments.includes(post.id) &&
                post.comments &&
                post.comments.length > 0 && (
                  <div className="post-comments">
                    <h4>Comments ({post.comments.length})</h4>
                    <div className="comments-list">
                      {post.comments.map((comment, index) => (
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
                          <div className="comment-content">
                            {comment.comment}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPosts;
