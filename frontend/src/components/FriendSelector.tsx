import React, { useEffect, useState } from "react";
import axios from "axios";

interface Friend {
  username: string;
  objectId: string;
}

interface FriendSelectorProps {
  onSelectFriend: (friend: Friend) => void;
}

const FriendSelector: React.FC<FriendSelectorProps> = ({ onSelectFriend }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const BASE_URL = "http://localhost:8080";

  useEffect(() => {
    const fetchFriends = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}/api/friends/myfriends`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFriends(response.data);
      } catch (err) {
        setError("Error fetching friends.");
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  if (loading) {
    return <p>Loading friends...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h3>Select a Friend</h3>
      <ul>
        {friends.map((friend) => (
          <li key={friend.objectId} onClick={() => onSelectFriend(friend)}>
            {friend.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendSelector;
