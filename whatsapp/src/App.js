import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// My APIs
import { getCurrentUser } from './api/userApi';
import { getAllNotificationsByUser } from './api/notificationApi';

// My Contexts
import { useUser } from "./context/userContext";
import { useNotification } from "./context/notificationContext";
import { ProtectedRoute } from './context/protectedRoute';

// My Components
import Login from './components/Login';
import Signup from './components/Signup';
import Friends from './components/Friends';
import Layout from './components/Layout';
import NotFound from './components/404';
import Settings from './components/Settings';
import SearchAllUsers from './components/SearchAllUsers';
import Notifications from './components/Notifications';

// My Socket
import socketIO from "socket.io-client";
let socket;

function App() {
  const { user, setUser, setLoading } = useUser();
  const { notifications, setNotifications } = useNotification();
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Fetch Current User Data
  useEffect(() => {
    const fetchUser = async () => {
      // If user already exists, skip fetching
      if (user) {
        setLoading(false);
        return;
      }
      const authToken = localStorage.getItem('authToken');
      // If no token is found, skip fetching and stop loading
      if (!authToken) {
        console.log("No auth token found, skipping user fetch.");
        setLoading(false);
        return;
      }
      try {
        // Fetch current user
        const userData = await getCurrentUser();
        setUser(userData.data); // Set user data
      } catch (error) {
        console.error("Failed to fetch user. Login required:", error?.response?.data?.message || error.message);
        localStorage.removeItem('authToken'); // Remove invalid token
      } finally {
        // Ensure loading state is updated
        setLoading(false);
      }
    };
    fetchUser();
  }, []); // Dependency array ensures it runs when `user` changes


  // Connect User to Socket
  useEffect(() => {
    const connectSocket = async () => {
      if (user) {
        // Ensure socket connection before emitting the event
        socket = socketIO.connect("http://localhost:4000");

        // Wait for socket to connect and then emit the newUser event
        socket.on("connect", () => {
          // Emit the new user event with socketID once connected
          socket.emit("newUser", {
            userName: user.username,
            userId: user._id,
            socketID: socket.id,
          });

          // Listen for the newUserResponse event
          socket.on("newUserResponse", (data) => {
            setOnlineUsers(data);
          });
        });
      }

      // Cleanup on unmount or user change
      return () => {
        if (socket) {
          socket.disconnect();
          socket.off("newUserResponse");
        }
      };
    };
    connectSocket();
  }, [user]);

  // Fetch Notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) return;
      try {
        const notificationData = await getAllNotificationsByUser();
        setNotifications(notificationData.data);
      } catch (error) {
        console.log('Login Required:', error.response.data.message);
      }
      return;
    }
    fetchNotifications();
  }, []);

  // Handle Offline Status: if you are not connected to internet
  useEffect(() => {
    const handleOffline = () => {
      alert("You are offline. Please check your internet connection.");
    };

    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      // Cleanup to avoid memory leaks
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="dashboard" element={
          <ProtectedRoute>
            <Layout socket={socket} />
          </ProtectedRoute>
        }>
          <Route path="" element={<Friends />} />
          <Route path="search" element={<SearchAllUsers socket={socket} onlineUsers={onlineUsers} />} />
          <Route path="chats" element={<Friends onlineUsers={onlineUsers} />} />
          <Route path="chats/:chatId" element={<Friends onlineUsers={onlineUsers} />} />
          <Route path="notifications" element={<Notifications socket={socket} />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
