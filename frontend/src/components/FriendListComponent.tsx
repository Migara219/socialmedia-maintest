import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BiUser, BiMessageSquare, BiSearch } from "react-icons/bi";
import { FaUserPlus, FaUserClock } from "react-icons/fa";
import { handleSessionExpired, checkAuthError } from "../utils/auth";
import "../styles/FriendList.css";

interface Friend {
  username: string;
  objectId: string;
}

interface RegisteredUser {
  username: string;
  objectId: string;
  requestSent: boolean;
}

interface FriendRequest {
  username: string;
  objectId: string;
}

const FriendListComponent: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredUsers = registeredUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !friends.some((friend) => friend.objectId === user.objectId) &&
      !friendRequests.some((request) => request.objectId === user.objectId)
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          handleSessionExpired(navigate);
          return;
        }

        const [friendsResponse, registeredUsersResponse, requestsResponse] =
          await Promise.all([
            axios.get("http://localhost:8080/api/friends/myfriends", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get("http://localhost:8080/api/friends/registered-users", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get("http://localhost:8080/api/friends/request/my", {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        setFriends(friendsResponse.data);
        setRegisteredUsers(registeredUsersResponse.data);

        // Add error handling for friend requests
        if (Array.isArray(requestsResponse.data)) {
          setFriendRequests(requestsResponse.data);
        } else {
          console.error("Invalid friend requests data format");
          setFriendRequests([]);
        }
      } catch (err: any) {
        if (!checkAuthError(err, navigate)) {
          setError("Failed to fetch data");
          console.error("Error fetching data:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleChatClick = (friendId: string) => {
    navigate(`/chat/chatroom?friendId=${friendId}`);
  };

  const handleSendRequest = async (userId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8080/api/friends/request/send",
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update local state to show request as pending
      setRegisteredUsers(
        registeredUsers.map((user) =>
          user.objectId === userId ? { ...user, requestSent: true } : user
        )
      );
    } catch (err) {
      console.error("Failed to send friend request:", err);
    }
  };

  const handleAcceptRequest = async (userId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8080/api/friends/request/accept",
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Remove the request from requests list
      setFriendRequests((requests) =>
        requests.filter((request) => request.objectId !== userId)
      );

      // Refresh friends list
      const friendsResponse = await axios.get(
        "http://localhost:8080/api/friends/myfriends",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFriends(friendsResponse.data);
    } catch (err) {
      console.error("Failed to accept friend request:", err);
    }
  };

  const getInitial = (username: string | undefined) => {
    return username ? username[0].toUpperCase() : "?";
  };

  // Add null checks before mapping
  const renderFriendRequests = () => {
    if (!friendRequests) return null;

    return friendRequests.map((request) => (
      <div key={request.objectId} className="friend-card">
        <div className="friend-info">
          <div className="friend-avatar">{getInitial(request.username)}</div>
          <span className="friend-name">
            {request.username || "Unknown User"}
          </span>
        </div>
        <div className="request-actions">
          <button
            className="accept-button"
            onClick={() => handleAcceptRequest(request.objectId)}
          >
            <FaUserPlus />
            <span>Accept</span>
          </button>
        </div>
      </div>
    ));
  };

  const handlePostClick = (username: string) => {
    navigate(`/posts/${username}`);
  };

  if (loading) {
    return (
      <div className="friends-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return <div className="friends-error">{error}</div>;
  }

  return (
    <div className="friends-container">
      {/* Search Bar */}
      <div className="search-container">
        <div className="search-wrapper">
          <BiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Friend Requests Section */}
      <section className="friend-requests-section">
        <h2>Friend Requests</h2>
        <div className="friends-list">
          {!friendRequests || friendRequests.length === 0 ? (
            <div className="no-friends">
              <p>No pending friend requests</p>
            </div>
          ) : (
            renderFriendRequests()
          )}
        </div>
      </section>

      {/* Friends List Section */}
      <section className="friends-section">
        <h2>My Friends</h2>
        {!friends || friends.length === 0 ? (
          <div className="no-friends">
            {searchQuery ? (
              <p>No friends match your search.</p>
            ) : (
              <>
                <BiUser className="no-friends-icon" />
                <p>You haven't added any friends yet.</p>
              </>
            )}
          </div>
        ) : (
          <div className="friends-list">
            {friends
              .filter((friend) =>
                friend.username
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
              )
              .map((friend) => (
                <div key={friend.objectId} className="friend-card">
                  <div className="friend-info">
                    <div className="friend-avatar">
                      {getInitial(friend.username)}
                    </div>
                    <span className="friend-name">
                      {friend.username || "Unknown User"}
                    </span>
                  </div>
                  <div className="friend-actions">
                    {/* New Post Button */}
                    <button
                      className="chat-button"
                      onClick={() => handlePostClick(friend.username)}
                      title="Post"
                    >
                      <BiMessageSquare />
                      <span>Post</span>
                    </button>
                    <button
                      className="chat-button"
                      onClick={() => handleChatClick(friend.objectId)}
                      title="Start chat"
                    >
                      <BiMessageSquare />
                      <span>Chat</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>

      {/* Registered Users Section */}
      <section className="other-users-section">
        <h2>Other Users</h2>
        <div className="friends-list">
          {!filteredUsers || filteredUsers.length === 0 ? (
            <div className="no-friends">
              <p>No users match your search.</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div key={user.objectId} className="friend-card">
                <div className="friend-info">
                  <div className="friend-avatar">
                    {getInitial(user.username)}
                  </div>
                  <span className="friend-name">
                    {user.username || "Unknown User"}
                  </span>
                </div>
                <button
                  className={`request-button ${
                    user.requestSent ? "pending" : "send"
                  }`}
                  onClick={() =>
                    !user.requestSent && handleSendRequest(user.objectId)
                  }
                  disabled={user.requestSent}
                >
                  {user.requestSent ? (
                    <>
                      <FaUserClock />
                      <span>Request Sent</span>
                    </>
                  ) : (
                    <>
                      <FaUserPlus />
                      <span>Send Request</span>
                    </>
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default FriendListComponent;
