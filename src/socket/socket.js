import { io } from "socket.io-client";
import { getRawToken } from "../utils/authToken";

let socket = null;

export const connectSocket = (customToken = null) => {
  // If socket exists with same auth, return it
  const token = customToken || getRawToken();
  
  if (socket?.connected && socket.auth?.token === token) {
    return socket;
  }

  // Disconnect old socket if auth changed
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  socket = io(import.meta.env.VITE_SOCKET_URL, {
    auth: { token},
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (!socket) return;
  socket.disconnect();
  socket = null;
};