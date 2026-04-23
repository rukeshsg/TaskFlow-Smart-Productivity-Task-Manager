import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

/**
 * Creates and manages a Socket.io connection authenticated with JWT.
 * Returns a stable socket instance via state (re-renders only on connect/disconnect).
 */
export const useSocket = (token) => {
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
      }
      return;
    }

    let socketUrl = import.meta.env.PROD 
      ? (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'https://taskflow-smart-productivity-task-manager.onrender.com')
      : window.location.origin;

    if (import.meta.env.PROD && !socketUrl.startsWith('http')) {
      socketUrl = 'https://' + socketUrl;
    }

    const s = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    s.on('connect', () => {
      console.log('🔌 Socket connected:', s.id);
      setSocket(s);
    });

    s.on('connect_error', (err) => {
      console.warn('Socket connect error:', err.message);
    });

    s.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
      setSocket(null);
    });

    socketRef.current = s;

    return () => {
      s.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
  }, [token]);

  return socket;
};
