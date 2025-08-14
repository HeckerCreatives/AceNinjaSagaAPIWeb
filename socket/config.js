const { io } = require("socket.io-client");

const socket = io(process.env.SOCKET_URL, {
    reconnection: true,
    transports: ['websocket'],
    query: {
        "token": "WEB"
    }
});

socket.on("connect", () => {
  console.log("[API] Connected to Socket Server:", socket.id);
});

module.exports = socket