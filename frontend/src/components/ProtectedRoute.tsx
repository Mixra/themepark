import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  isAllowed: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, isAllowed }) => {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('level') !== null;

  if (isLoggedIn && !isAllowed) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!isLoggedIn && isAllowed) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
