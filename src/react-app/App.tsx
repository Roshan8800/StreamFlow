import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider } from "@getmocha/users-service/react";
import HomePage from "@/react-app/pages/Home";
import AuthCallbackPage from "@/react-app/pages/AuthCallback";
import VideoPage from "@/react-app/pages/Video";
import ProfilePage from "@/react-app/pages/Profile";
import SearchPage from "@/react-app/pages/Search";
import CategoryPage from "@/react-app/pages/Category";
import AboutPage from "@/react-app/pages/About";
import AdminPage from "@/react-app/pages/Admin";
import SettingsPage from "@/react-app/pages/Settings";
import FavoritesPage from "@/react-app/pages/Favorites";
import DashboardPage from "@/react-app/pages/Dashboard";
import AnalyticsPage from "@/react-app/pages/Analytics";
import DirectoryPage from "@/react-app/pages/Directory";
import ContentSubmissionPage from "@/react-app/pages/ContentSubmission";
import AdminContentManagerPage from "@/react-app/pages/AdminContentManager";
import Navigation from "@/react-app/components/Navigation";
import "./globals.css";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-950 text-white">
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/video/:id" element={<VideoPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/directory" element={<DirectoryPage />} />
            <Route path="/submit" element={<ContentSubmissionPage />} />
            <Route path="/admin/content-manager" element={<AdminContentManagerPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
