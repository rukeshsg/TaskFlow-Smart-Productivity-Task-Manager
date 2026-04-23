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

    const s = io(window.location.origin, {
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
