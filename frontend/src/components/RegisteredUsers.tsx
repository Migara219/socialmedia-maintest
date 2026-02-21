import React, { useEffect, useState } from 'react';
import { FaUserPlus, FaUserClock } from 'react-icons/fa';
import '../styles/FriendList.css';

interface User {
    username: string;
    objectId: string;
    requestSent: boolean;
}

const RegisteredUsers: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/friends/registered-users', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const sendFriendRequest = async (userId: string) => {
        try {
            const response = await fetch('http://localhost:8080/api/friends/request/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ userId })
            });

            if (response.ok) {
                // Update local state to show request as pending
                setUsers(users.map(user => 
                    user.objectId === userId 
                        ? { ...user, requestSent: true }
                        : user
                ));
            }
        } catch (err) {
            console.error('Failed to send friend request:', err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) return <div className="friends-loading">Loading...</div>;
    if (error) return <div className="friends-error">{error}</div>;

    return (
        <div className="friends-container">
            <h2>Registered Users</h2>
            <div className="friends-list">
                {users.map(user => (
                    <div key={user.objectId} className="friend-card">
                        <div className="friend-info">
                            <div className="friend-avatar">
                                {user.username[0].toUpperCase()}
                            </div>
                            <span className="friend-name">{user.username}</span>
                        </div>
                        <button 
                            className={`request-button ${user.requestSent ? 'pending' : 'send'}`}
                            onClick={() => !user.requestSent && sendFriendRequest(user.objectId)}
                            disabled={user.requestSent}
                        >
                            {user.requestSent ? (
                                <>
                                    <FaUserClock />
                                    Request Sent
                                </>
                            ) : (
                                <>
                                    <FaUserPlus />
                                    Send Request
                                </>
                            )}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RegisteredUsers; 