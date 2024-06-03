import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import MySVGComponent from './MySVGComponent';
import Companies from './Companies';
import DesktopSetup from './companies/DesktopSetup';
import CompanyDashboard from './CompanyDashboard';

// Function to check authentication status
const checkAuthentication = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Main App component
export default function App() {
  const [authenticated, setAuthenticated] = useState(checkAuthentication());

  // Function to handle login
  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post('http://127.0.0.1:6363/api/login', {
        username: username,
        password: password,
      });

      if (response.data.success) {
        setAuthenticated(true);
        localStorage.setItem('token', response.data.token);
        navigate('/companies');
      } else {
        console.error('Incorrect username or password.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    setAuthenticated(false);
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <Router>
      <Routes>
        {/* Route for the main page, redirects to /companies if authenticated */}
        <Route
          path="/"
          element={authenticated ? <Navigate to="/companies" replace /> : <MySVGComponent setAuthenticated={setAuthenticated} handleLogin={handleLogin} />}
        />
        {/* Route for companies page, redirects to / if not authenticated */}
        <Route
          path="/companies"
          element={authenticated ? <Companies handleLogout={handleLogout} /> : <Navigate to="/" replace />}
        />
        <Route
          path="/companies/desktop-setup"
          element={authenticated ? <DesktopSetup /> : <Navigate to="/" replace />}
        />
          <Route
          path="/:dbName/company-dashboard"
          element={authenticated ? <CompanyDashboard /> : <Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
}
