import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Assuming useAuthStore will store admin token or role in future,
  // or we can use localStorage directly for admin token for separation.
  const adminToken = localStorage.getItem('adminToken');
  const location = useLocation();

  if (!adminToken) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
