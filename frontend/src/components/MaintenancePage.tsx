import React from "react";
import "../styles/MaintenancePage.css";
import { BiWrench, BiServer } from "react-icons/bi";

const MaintenancePage: React.FC = () => {
  return (
    <div className="maintenance-container">
      <div className="maintenance-content">
        <div className="maintenance-animation">
          <BiServer className="server-icon" />
          <BiWrench className="wrench-icon" />
        </div>
        <h1>Server Under Maintenance</h1>
        <p>
          We're currently performing some updates to make things even better.
        </p>
        <p className="sub-text">We'll be back online as soon as possible!</p>
        <button
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default MaintenancePage;
