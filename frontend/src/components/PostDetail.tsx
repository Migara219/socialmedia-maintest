import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";
import { BiTime } from "react-icons/bi";
import "../styles/PostDetail.css"; // Ensure you have this CSS file

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

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axiosInstance.get(`/api/posts/postid/${id}`);
        setPost(response.data);
      } catch (err: any) {
        setError("Failed to fetch post details. Please try again later.");
      }
    };

    fetchPost();
  }, [id]);

  const handleCommentChange = (value: string) => {
    setCommentInput(value);
  };

  const submitComment = async () => {
    if (!post) return;

    try {
      await axiosInstance.post(`/api/posts/${post.id}/comment`, {
        comment: commentInput,
      });
      setCommentInput(""); // Clear input after submission
      // Optionally, you can refetch the post to get the latest comments
      const response = await axiosInstance.get(`/api/posts/postid/${id}`);
      setPost(response.data);
    } catch (err: any) {
      setError("Failed to post comment. Please try again later.");
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="post-card">
      <button onClick={() => navigate("/feed")} className="back-button">
        Back to Feed
      </button>
      <h2>{post.user}'s Post</h2>
      <p>{post.content}</p>
      <h3>Posted on:</h3>
      <span className="post-date">
        <BiTime />{" "}
        {new Date(
          post.createdAt[0],
          post.createdAt[1] - 1,
          post.createdAt[2]
        ).toLocaleString()}
      </span>
      <h3>Comments:</h3>
      {post.comments && post.comments.length > 0 ? (
        post.comments.map((comment, index) => (
          <div key={index} className="comment">
            <strong>{comment.user}:</strong> {comment.comment}
          </div>
        ))
      ) : (
        <p>No comments yet.</p>
      )}
      <div className="comment-input">
        <input
          type="text"
          placeholder="Add a comment..."
          value={commentInput}
          onChange={(e) => handleCommentChange(e.target.value)}
          className="comment-input-field"
        />
        <button onClick={submitComment} className="comment-submit-button">
          Submit
        </button>
      </div>
    </div>
  );
};

export default PostDetail;
