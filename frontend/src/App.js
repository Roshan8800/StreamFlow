import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// Components
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import VideoPlayer from "./pages/VideoPlayer";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./pages/UserManagement";
import VideoManagement from "./pages/VideoManagement";
import Analytics from "./pages/Analytics";
import { Toaster } from "./components/ui/sonner";

// Context
const AppContext = React.createContext();

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock authentication check
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('playNiteToken');
      const userData = localStorage.getItem('playNiteUser');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('playNiteToken', token);
    localStorage.setItem('playNiteUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('playNiteToken');
    localStorage.removeItem('playNiteUser');
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <div className="loading-text">PlayNite</div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ user, login, logout, sidebarOpen, setSidebarOpen }}>
      <div className="App">
        <BrowserRouter>
          {user ? (
            <div className="app-layout">
              <Header />
              <div className="main-content">
                <Sidebar />
                <div className={`content-area ${sidebarOpen ? 'sidebar-open' : ''}`}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/video/:id" element={<VideoPlayer />} />
                    <Route path="/profile" element={<Profile />} />
                    
                    {/* Admin Routes */}
                    {user.role === 'admin' && (
                      <>
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/admin/users" element={<UserManagement />} />
                        <Route path="/admin/videos" element={<VideoManagement />} />
                        <Route path="/admin/analytics" element={<Analytics />} />
                      </>
                    )}
                    
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </div>
              </div>
            </div>
          ) : (
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          )}
        </BrowserRouter>
        <Toaster />
      </div>
    </AppContext.Provider>
  );
}

export { AppContext };
export default App;