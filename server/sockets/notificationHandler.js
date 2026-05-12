const Notification = require('../models/Notification');

module.exports = (io) => {
  // Store connected users. Key: userId, Value: socketId
  const connectedUsers = new Map();

  io.on('connection', (socket) => {
    console.log(`User connected to Socket.IO: ${socket.id}`);

    // Event when a user authenticates/connects their socket
    socket.on('join', (userId) => {
      connectedUsers.set(userId, socket.id);
      console.log(`User ${userId} joined with socket ${socket.id}`);
    });

    // Handle generic notification sending
    socket.on('send_notification', async (data) => {
      try {
        const { senderId, recipientId, type, postId, recipeId } = data;

        // Save notification to DB
        const notification = await Notification.create({
          sender: senderId,
          recipient: recipientId,
          type,
          post: postId,
          recipe: recipeId
        });

        const populatedNotification = await notification.populate('sender', 'username profileImage');

        // Check if recipient is online
        const recipientSocketId = connectedUsers.get(recipientId);
        if (recipientSocketId) {
          // Emit the notification live
          io.to(recipientSocketId).emit('new_notification', populatedNotification);
        }
      } catch (error) {
        console.error('Socket notification error:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      for (let [userId, socketId] of connectedUsers.entries()) {
        if (socketId === socket.id) {
          connectedUsers.delete(userId);
          console.log(`User ${userId} disconnected.`);
          break;
        }
      }
    });
  });
};
