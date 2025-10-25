import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext'; // To connect only when logged in

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { token } = useAuth(); // Get auth state

  useEffect(() => {
    // Only connect if the user is an admin (has a token)
    // You can adjust this logic if viewers also need socket access
    if (token) {
      // Connect to your backend server
      // We use '/api' as the path because of the Vite proxy.
      // The `path` option is crucial for making it work with the proxy.
      const newSocket = io({
        path: '/api/socket.io',
      });

      setSocket(newSocket);

      // Clean up the connection when the component unmounts or token changes
      return () => newSocket.close();
    } else {
      // If no token, disconnect any existing socket
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [token]); // Re-run this effect when the auth token changes

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
