import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './authContextDef';
import { getToken, setToken, fetchWithAuth, TOKEN_STORAGE_KEY } from '../utils/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(() => getToken());
  const [isLoading, setIsLoading] = useState(() => Boolean(getToken()));

  // Validate existing token and hydrate user on initial load
  useEffect(() => {
    let isMounted = true;
    const initialToken = getToken();

    if (!initialToken) {
      return;
    }

    fetchWithAuth('/api/auth/me')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Session expired or invalid');
        }
        return res.json();
      })
      .then((data) => {
        if (isMounted && data.user) {
          setUser(data.user);
          setTokenState(initialToken);
        }
      })
      .catch(() => {
        if (isMounted) {
          setToken(null);
          setTokenState(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Listen for automatic token expiration triggered by API fetcher
  useEffect(() => {
    const handleAuthExpired = () => {
      setUser(null);
      setTokenState(null);
    };

    window.addEventListener('auth:expired', handleAuthExpired);
    return () => {
      window.removeEventListener('auth:expired', handleAuthExpired);
    };
  }, []);

  // Listen for storage changes in other browser tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === TOKEN_STORAGE_KEY) {
        const updatedToken = e.newValue;
        if (!updatedToken) {
          setUser(null);
          setTokenState(null);
        } else if (updatedToken !== token) {
          setTokenState(updatedToken);
          fetchWithAuth('/api/auth/me')
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
              if (data?.user) {
                setUser(data.user);
              }
            })
            .catch(() => {
              setUser(null);
              setTokenState(null);
            });
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [token]);

  const login = useCallback(async (username, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Login failed. Please check your credentials.');
    }

    setToken(data.access_token);
    setTokenState(data.access_token);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenState(null);
    setUser(null);
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
