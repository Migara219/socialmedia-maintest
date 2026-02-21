import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BiUser,
  BiGroup,
  BiEnvelope,
  BiShield,
  BiCalendar,
  BiLock,
} from "react-icons/bi";
import { handleSessionExpired } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

interface ProfileData {
  username: string;
  email: string;
  roles: string;
  createdAt: number[];
  friendsCount: number;
}

const Profile: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          handleSessionExpired(navigate);
          return;
        }

        const response = await axios.get(
          "http://localhost:8080/api/user/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.error) {
          throw new Error(response.data.error);
        }

        setProfileData(response.data);
      } catch (err: any) {
        console.error("Error fetching profile:", err);
        setError(err.response?.data?.message || "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

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

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8080/api/user/change-password",
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPasswordSuccess("Password updated successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordChange(false);
    } catch (err: any) {
      setPasswordError(
        err.response?.data?.message || "Failed to update password"
      );
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return <div className="profile-error">{error}</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {profileData?.username?.[0]?.toUpperCase()}
          </div>
          <h2>{profileData?.username}</h2>
        </div>

        <div className="profile-info">
          <div className="info-item">
            <BiUser className="info-icon" />
            <div className="info-content">
              <label>Username</label>
              <span>{profileData?.username}</span>
            </div>
          </div>

          <div className="info-item">
            <BiEnvelope className="info-icon" />
            <div className="info-content">
              <label>Email</label>
              <span>{profileData?.email}</span>
            </div>
          </div>

          <div className="info-item">
            <BiShield className="info-icon" />
            <div className="info-content">
              <label>Role</label>
              <span>{profileData?.roles?.replace("ROLE_", "")}</span>
            </div>
          </div>

          <div className="info-item">
            <BiGroup className="info-icon" />
            <div className="info-content">
              <label>Friends</label>
              <span>{profileData?.friendsCount} friends</span>
            </div>
          </div>

          <div className="info-item">
            <BiCalendar className="info-icon" />
            <div className="info-content">
              <label>Member Since</label>
              <span>{formatDate(profileData?.createdAt || [])}</span>
            </div>
          </div>
        </div>

        <div className="password-section">
          <button
            className="change-password-btn"
            onClick={() => setShowPasswordChange(!showPasswordChange)}
          >
            <BiLock /> Change Password
          </button>

          {showPasswordChange && (
            <form onSubmit={handlePasswordChange} className="password-form">
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
              {passwordError && (
                <div className="error-message">{passwordError}</div>
              )}
              {passwordSuccess && (
                <div className="success-message">{passwordSuccess}</div>
              )}
              <div className="button-group">
                <button type="submit" className="submit-btn">
                  Update Password
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowPasswordChange(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
