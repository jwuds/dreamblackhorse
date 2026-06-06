import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Loader2 } from 'lucide-react';
import { getAccessToken, validateToken } from '@/utils/tokenStorage';

const ProtectedAdminRoute = ({ children }) => {
  const { currentUser, loading, isSessionValid } = useAdminAuth();
  const location = useLocation();
  const [isValidating, setIsValidating] = useState(true);
  const [hasValidAccess, setHasValidAccess] = useState(false);

  useEffect(() => {
    try {
      const token = getAccessToken();
      const isValidToken = token && validateToken(token);
      const isSessionActive = isSessionValid();
      
      if (isValidToken && isSessionActive && currentUser) {
        // Optional: Perform specific admin role check here if roles are configured
        // const isAdmin = currentUser?.user_metadata?.role === 'admin';
        setHasValidAccess(true);
      } else {
        setHasValidAccess(false);
      }
    } catch (error) {
      console.error(`[Auth Error] ${new Date().toISOString()}: Admin route validation failed`, error);
      setHasValidAccess(false);
    } finally {
      setIsValidating(false);
    }
  }, [currentUser, isSessionValid]);

  if (loading || isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111] text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
          <p className="text-gray-400 font-medium">Securing admin environment...</p>
        </div>
      </div>
    );
  }

  // Check if unauthenticated, session timed out, or token is missing/invalid
  if (!currentUser || !hasValidAccess) {
    console.warn(`[Auth Info] ${new Date().toISOString()}: Denied admin access to ${location.pathname}`);
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedAdminRoute;