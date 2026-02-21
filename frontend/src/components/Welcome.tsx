import React, { useEffect, useState } from "react";
import { getWelcomeMessage } from "../services/ApiService";
import "../styles/Welcome.css";

const Welcome: React.FC = () => {
  const [message, setMessage] = useState<string>("Loading...");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const result = await getWelcomeMessage();
        setMessage(result);
        setIsLoading(false);
      } catch (error) {
        setMessage("Welcome to our community!");
        setIsLoading(false);
      }
    };

    fetchMessage();
  }, []);

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <img src="/logo.png" alt="EchoNet Logo" className="logo" />
        <h1 className="display-4">Welcome to EchoNet</h1>
        <p className={`lead ${isLoading ? "loading" : ""}`}>{message}</p>
        <p className="description">
          Connect with friends, share moments, and be part of a vibrant
          community. EchoNet brings people together in a safe and engaging
          environment where every conversation matters.
        </p>
        <div className="button-container">
          <a
            href="http://localhost:5173/auth/signup"
            className="auth-button signup-btn"
          >
            Get Started
          </a>
          <a
            href="http://localhost:5173/auth/login"
            className="auth-button login-btn"
          >
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
