import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BsSend } from "react-icons/bs";
import "../styles/CreatePost.css";

const CreatePost: React.FC = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8080/api/posts/upload",
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      navigate("/posts/myposts");
    } catch (err) {
      setError("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <div className="create-post-card">
        <h2>Create New Post</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="content">What's on your mind?</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts..."
              rows={6}
              required
            />
          </div>
          <div className="button-group">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/posts/myposts")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={loading || !content.trim()}
            >
              {loading ? (
                "Creating..."
              ) : (
                <>
                  <BsSend /> Post
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
