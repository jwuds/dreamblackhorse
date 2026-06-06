import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { getAccessToken, validateToken } from '@/utils/tokenStorage';
import { logInfo, logAuthError } from '@/utils/errorLogger';

const ProtectedRoute = ({ children }) => {
  const { user, loading, clearAuthState } = useAuth();
  const location = useLocation();
  const [isValidating, setIsValidating] = useState(true);
  const [hasValidToken, setHasValidToken] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAccess = async () => {
      try {
        if (loading) return; // Wait for AuthContext to finish

        const token = getAccessToken();
        if (token && validateToken(token) && user) {
          if (mounted) setHasValidToken(true);
        } else {
          logInfo(`Unauthorized access attempt to ${location.pathname} - Token/User missing or invalid`);
          if (mounted) setHasValidToken(false);
          // If we have a token but no user (or vice versa), state is out of sync.
          if (token && !user) {
             await clearAuthState();
          }
        }
      } catch (error) {
        logAuthError(`Route protection validation failed for ${location.pathname}`, error);
        if (mounted) setHasValidToken(false);
      } finally {
        if (mounted) setIsValidating(false);
      }
    };

    checkAccess();

    return () => {
      mounted = false;
    };
  }, [user, loading, location.pathname, clearAuthState]);

  if (loading || isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-[#d4af37] animate-spin" />
          <p className="text-gray-400 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!user || !hasValidToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;