let Server; // will be lazy-required inside socketserver
let io; // store globally

const getIo = () => {
    if (!io) {
        throw new Error("Socket.io not initialized yet!");
    }
    return io;
};

const socketserver = async (server, corsconfig) => {
    // Lazy-require socket.io to avoid throwing during module require if the package
    // isn't installed in some environments (tests, tooling, etc.). The real Server
    // will be initialized when socketserver is called at runtime.
    if (!Server) {
        try {
            Server = require('socket.io').Server;
        } catch (err) {
            throw new Error('socket.io is required to initialize the socket server: ' + err.message);
        }
    }

    io = new Server(server, {
        cors: corsconfig,
        pingInterval: 10000,
        pingTimeout: 20000
    })

    io.on('connection', (socket) => {
        console.log(`New client connected: ${socket.id}`);

        // Allow clients to join a room (useful for upload socketId rooms)
        socket.on('joinRoom', (roomId) => {
            if (!roomId) return;
            try {
                socket.join(roomId);
                console.log(`Socket ${socket.id} joined room ${roomId}`);
            } catch (err) {
                console.warn('Failed to join room', err.message || err);
            }
        });

        // Forward events from game API clients to frontend rooms
        // Expecting payload: { socketId, file, status, progress }
        socket.on('game:patchstatus', (payload) => {
            if (!payload || !payload.socketId) return;
            try {
                io.to(payload.socketId).emit('fileUploadStatus', {
                    file: payload.file,
                    status: payload.status,
                    progress: payload.progress
                });
            } catch (err) {
                console.warn('Failed to forward game:patchstatus', err.message || err);
            }
        });

        socket.on('disconnect', (reason) => {
            console.log(`Client disconnected: ${socket.id} (${reason})`);
        });

        // eventconnection(io, socket);
    });
}

module.exports = {
  socketserver,
  getIo
};