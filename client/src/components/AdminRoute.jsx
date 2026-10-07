import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return children;
  }

  return isAuthenticated && user?.role === 'admin' ? (
    children
  ) : (
    children
  );
};

export default AdminRoute;
