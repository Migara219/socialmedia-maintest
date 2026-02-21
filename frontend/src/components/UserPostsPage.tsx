import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BiTime } from "react-icons/bi";
import axiosInstance from "../utils/axiosConfig"; // Import axiosInstance
import { handleSessionExpired, checkAuthError } from "../utils/auth";
import "../styles/UserPostsPage.css"; // Import UserPostsPage.css for styles

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

const UserPostsPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          handleSessionExpired(navigate);
          return;
        }

        const response = await axiosInstance.get(
          `http://localhost:8080/api/posts/${username}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPosts(response.data);
      } catch (err: any) {
        console.error("Error fetching posts:", err);
        if (!checkAuthError(err, navigate)) {
          setError(`Failed to fetch posts: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [username, navigate]);

  if (loading) {
    return (
      <div className="posts-loading">
        <div className="loading-spinner"></div>
        <p>Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return <div className="posts-error">{error}</div>;
  }

  // Filter posts based on search query
  const filteredPosts = posts.filter((post) =>
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="posts-container">
      <h2>Posts by {username}</h2>

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
        <p>No posts available for this user.</p>
      ) : (
        <div className="posts-list">
          {filteredPosts.map((post) => (
            <div key={post.id} className="post-card">
              <div
                className="post-header"
                onClick={() => navigate(`/posts/postid/${post.id}`)}
              >
                <span className="username">{post.user}</span>
                <span className="post-date">
                  <BiTime />{" "}
                  {new Date(
                    post.createdAt[0],
                    post.createdAt[1] - 1,
                    post.createdAt[2],
                    post.createdAt[3],
                    post.createdAt[4],
                    post.createdAt[5]
                  ).toLocaleString()}
                </span>
              </div>
              <div className="post-content">{post.content}</div>
              {post.comments && post.comments.length > 0 && (
                <div className="post-comments">
                  <h4>Comments:</h4>
                  {post.comments.map((comment) => (
                    <div
                      key={comment.id || `${post.id}-${Math.random()}`}
                      className="comment"
                    >
                      <span className="comment-user">{comment.user}</span>:{" "}
                      {comment.comment}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPostsPage;
