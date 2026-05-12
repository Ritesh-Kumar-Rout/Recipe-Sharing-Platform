const mongoose = require('mongoose');

const savedPostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  }
}, { timestamps: true });

// Prevent duplicate saves
savedPostSchema.index({ user: 1, post: 1 }, { unique: true, sparse: true });
savedPostSchema.index({ user: 1, recipe: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('SavedPost', savedPostSchema);
