import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Nav from './components/Nav';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Product from './components/Product'; // Make sure this exists
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined') {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // 🔐 Protect routes that require login
  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  // 🚫 Redirect logged-in users from login/signup
  const RedirectIfAuthenticated = ({ children }) => {
    return user ? <Navigate to="/product" /> : children;
  };

  return (
    <div>
      <Nav user={user} setUser={setUser} />
      <div className="container mt-4">
        {!loading && (
          <Routes>
            {/* Default redirect based on auth */}
            <Route path="/" element={<Navigate to={user ? "/product" : "/login"} />} />

            {/* Public routes */}
            <Route path="/login" element={
              <RedirectIfAuthenticated>
                <Login setUser={setUser} />
              </RedirectIfAuthenticated>
            } />

            <Route path="/signup" element={
              <RedirectIfAuthenticated>
                <SignUp setUser={setUser} />
              </RedirectIfAuthenticated>
            } />

            {/* Private route */}
            <Route path="/product" element={
              <PrivateRoute>
                <Product />
              </PrivateRoute>
            } />

            {/* Catch-all */}
            <Route path="*" element={<h2>404 - Page Not Found</h2>} />
          </Routes>
        )}
      </div>
    </div>
  );
}

export default App;
