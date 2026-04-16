import { io } from 'socket.io-client';

const SOCKET_URL = 'https://lovechat-signaling.onrender.com'; // Placeholder - user needs to deploy server

const socket = io(SOCKET_URL, {
  autoConnect: false,
});

export default socket;
