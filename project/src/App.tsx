import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FindFoodPage from './pages/FindFoodPage';
import DonatePage from './pages/DonatePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ChatsPage from './pages/ChatsPage';
import AboutPage from './pages/AboutPage';
import DonorProfilePage from './pages/DonorProfilePage';
import FAQPage from './pages/FAQPage';
import { AuthProvider, useAuth } from './context/AuthContext';

/**
 * ProtectedRoute Component
 * A higher-order component that protects routes requiring authentication
 * @param children - The child components to be rendered if user is authenticated
 * @returns Either the protected content or redirects to login page
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};
function App() {
  return (
    <Router>
      {/* AuthProvider wraps the entire app to provide authentication context */}
      <AuthProvider>
        {/* Routes component defines all available routes in the application */}
        <Routes>
          {/* Show home page by default */}
          <Route path="/" element={<HomePage />} />

          {/* Public routes accessible to all users */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/find" element={<FindFoodPage />} />
          <Route path="/donate" element={<DonatePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/faq" element={<FAQPage />} />

          {/* Protected routes that require authentication */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/chats" element={<ProtectedRoute><ChatsPage /></ProtectedRoute>} />

          {/* Special routes */}
          <Route path="/donor/:donorId" element={<DonorProfilePage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;