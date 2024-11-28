import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Login from './components/Auth/Login';
import Navbar from './components/Layout/Navbar';
import PrivateRoute from './components/Layout/PrivateRoute';
import Files from './pages/Files';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/files"
          element={
            <PrivateRoute>
              <Files />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/files" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
