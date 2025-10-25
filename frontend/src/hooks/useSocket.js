import { useContext } from 'react';
import { SocketContext } from '../context/SocketContext';

// Same as useAuth, this is just a clean shortcut
// const socket = useSocket();
const useSocket = () => {
  return useContext(SocketContext);
};

export default useSocket;
