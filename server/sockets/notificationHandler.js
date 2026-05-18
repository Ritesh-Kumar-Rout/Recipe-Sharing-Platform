const Notification = require('../models/Notification');

let ioInstance;
const connectedUsers = new Map();

const notificationHandler = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    // Event when a user authenticates/connects their socket
    socket.on('join', (userId) => {
      connectedUsers.set(userId.toString(), socket.id);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      for (let [userId, socketId] of connectedUsers.entries()) {
        if (socketId === socket.id) {
          connectedUsers.delete(userId);
          break;
        }
      }
    });
  });
};

/**
 * Send notification live and save to DB
 * @param {Object} data - { senderId, recipientId, type, postId, recipeId }
 */
const sendNotification = async (data) => {
  try {
    const { senderId, recipientId, type, postId, recipeId } = data;

    // Don't notify if sender is the recipient
    if (senderId.toString() === recipientId.toString()) return;

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
    const recipientSocketId = connectedUsers.get(recipientId.toString());
    if (recipientSocketId && ioInstance) {
      // Emit the notification live
      ioInstance.to(recipientSocketId).emit('new_notification', populatedNotification);
    }
    
    return notification;
  } catch (error) {
    console.error('Send notification error:', error);
  }
};

module.exports = {
  notificationHandler,
  sendNotification
};
