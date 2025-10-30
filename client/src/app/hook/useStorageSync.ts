"use client";

import { useEffect, useState } from 'react';

export const useStorageSync = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getAuthData = () => {
    if (!isClient) return { token: null, user: null };
    
    // Check sessionStorage first, then localStorage as fallback
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    const user = sessionStorage.getItem('user') || localStorage.getItem('user');
    
    return {
      token,
      user: user ? JSON.parse(user) : null
    };
  };

  const setAuthData = (token: string, user: any) => {
    if (!isClient) return;
    
    // Store in both for consistency
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    // Trigger custom event for same-tab sync
    window.dispatchEvent(new Event('authStateChange'));
    // Trigger storage event for cross-tab sync
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'token',
      newValue: token
    }));
  };

  const clearAuthData = () => {
    if (!isClient) return;
    
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Trigger sync events
    window.dispatchEvent(new Event('authStateChange'));
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'token',
      newValue: null
    }));
  };

  return {
    getAuthData,
    setAuthData,
    clearAuthData,
    isClient
  };
};