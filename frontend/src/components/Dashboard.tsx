import React from "react";
import "../styles/ForDashboard.css";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="dashboard">
      <h1>Welcome to EchoNet</h1>
      <div className="options">
        <button onClick={() => handleNavigation("/posts/myposts")}>
          My Posts
        </button>
        <button onClick={() => handleNavigation("/chat/chatroom")}>
          Chat Room
        </button>
        <button onClick={() => handleNavigation("/friends")}>Friends</button>
        <button onClick={() => handleNavigation("/requests")}>
          Friend Requests
        </button>
        <button onClick={() => handleNavigation("/feed")}>My Feed</button>
        <button onClick={() => handleNavigation("/chat/newchatroom")}>
          New Chat room
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
