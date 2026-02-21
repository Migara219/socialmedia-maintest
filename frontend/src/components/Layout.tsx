import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  BiHomeAlt,
  BiMessageSquare,
  BiUser,
  BiNews,
  BiUserCircle,
} from "react-icons/bi";
import { FiChevronLeft, FiChevronRight, FiLogOut } from "react-icons/fi";
import "../styles/Layout.css";

const Layout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/auth/login");
  };

  return (
    <div className="app-layout">
      <nav className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <div className="logo-container">
          {!isCollapsed && (
            <img src="/logo.png" alt="EchoNet Logo" className="nav-logo" />
          )}
          {!isCollapsed && <h1>EchoNet</h1>}
        </div>
        <div className="nav-links">
          <NavLink to="/feed" className="nav-item" title="My Feed">
            <BiNews />
            {!isCollapsed && <span>My Feed</span>}
          </NavLink>
          <NavLink to="/posts/myposts" className="nav-item" title="My Posts">
            <BiHomeAlt />
            {!isCollapsed && <span>My Posts</span>}
          </NavLink>
          <NavLink to="/chat/chatroom" className="nav-item" title="Messages">
            <BiMessageSquare />
            {!isCollapsed && <span>Messages</span>}
          </NavLink>
          <NavLink to="/friends/myfriends" className="nav-item" title="Friends">
            <BiUser />
            {!isCollapsed && <span>Friends</span>}
          </NavLink>
          <NavLink to="/profile" className="nav-item" title="Profile">
            <BiUserCircle />
            {!isCollapsed && <span>Profile</span>}
          </NavLink>
        </div>
        <div className="sidebar-footer">
          <button
            className="nav-item logout-btn"
            onClick={handleLogout}
            title="Logout"
          >
            <FiLogOut className="logout-icon" />
            {!isCollapsed && <span className="logout-text">Logout</span>}
          </button>
          <button
            className="toggle-button"
            onClick={toggleSidebar}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        </div>
      </nav>
      <main className={`main-content ${isCollapsed ? "expanded" : ""}`}>
        <div className="content-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
