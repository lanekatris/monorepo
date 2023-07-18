import { useEffect, useState } from 'react';

interface AuthState {
  token?: string;
}

export function useAuth(): AuthState {
  const [token, setToken] = useState(localStorage.getItem('token'));

  function handleStorageEvent(e: StorageEvent) {
    console.log('storage event', e);
    if (e.key !== 'token') return;
    setToken(e.newValue);
  }

  useEffect(() => {
    window.addEventListener('storage', handleStorageEvent);
    return () => {
      console.log('removed listener');
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  return { token };
}
