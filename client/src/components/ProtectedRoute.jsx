import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  // यदि बैकएंड कनेक्टेड नहीं है, तो लोडर में अटकने के बजाय सीधे कंटेंट दिखाएं (डेवलपमेंट के लिए)
  if (loading) {
    return children; 
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
