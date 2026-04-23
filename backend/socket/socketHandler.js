const jwt = require('jsonwebtoken');

const socketHandler = (io) => {
  // Middleware: authenticate socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;
    const room = `user:${userId}`;

    // Join user-specific room for isolated real-time updates
    socket.join(room);
    console.log(`🔌 Socket connected: ${socket.id} → room: ${room}`);

    socket.on('disconnect', (reason) => {
      console.log(`🔌 Socket disconnected: ${socket.id} — reason: ${reason}`);
    });

    socket.on('error', (err) => {
      console.error(`Socket error for ${socket.id}:`, err.message);
    });
  });
};

module.exports = socketHandler;
