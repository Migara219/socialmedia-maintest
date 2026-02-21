import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Welcome from "./components/Welcome";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import FriendListComponent from "./components/FriendListComponent";
import ChatRoomComponent from "./components/ChatRoomComponent";
import UserPosts from "./components/UserPosts";
import CreatePost from "./components/CreatePost";
import Layout from "./components/Layout";
import { isAuthenticated } from "./utils/auth";
import Feed from "./components/Feed";
import { withServerCheck } from "./components/withServerCheck";
import Profile from "./components/Profile";
import PostDetail from "./components/PostDetail";
import UserPostsPage from './components/UserPostsPage';

const ProtectedRouteWrapper = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error("Please login to access this page", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setTimeout(() => {
        navigate("/auth/login");
      }, 1000);
    }
  }, [navigate]);

  return isAuthenticated() ? <>{children}</> : null;
};

// Wrap components that need server check
const ProtectedLayoutWithServerCheck = withServerCheck(Layout);
const LoginWithServerCheck = withServerCheck(Login);
const SignUpWithServerCheck = withServerCheck(SignUp);
const WelcomeWithServerCheck = withServerCheck(Welcome);

const App: React.FC = () => {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/auth/welcome" replace />} />
        <Route path="/auth/welcome" element={<WelcomeWithServerCheck />} />
        <Route path="/auth/login" element={<LoginWithServerCheck />} />
        <Route path="/auth/signup" element={<SignUpWithServerCheck />} />

        {/* Protected routes with layout */}
        <Route element={<Layout />}>
          <Route path="/posts/myposts" element={<UserPosts />} />
          <Route path="/posts/create" element={<CreatePost />} />
          <Route path="/chat/chatroom" element={<ChatRoomComponent />} />
          <Route path="/friends/myfriends" element={<FriendListComponent />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/posts/postid/:id" element={<PostDetail />} />
          <Route path="/posts/:username" element={<UserPostsPage />} />
        </Route>

        {/* Catch all route with notification */}
        <Route
          path="*"
          element={
            <ProtectedRouteWrapper>
              <Navigate to="/auth/welcome" replace />
            </ProtectedRouteWrapper>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
