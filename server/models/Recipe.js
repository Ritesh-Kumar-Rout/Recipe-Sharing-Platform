const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true
  },
  description: {
    type: String
  },
  image: {
    type: String,
    required: true
  },
  ingredients: [{
    type: String,
    required: true
  }],
  steps: [{
    type: String
  }],
  prepTime: {
    type: String, // e.g. "15 mins"
    default: "0 mins"
  },
  cookTime: {
    type: String, // e.g. "45 mins"
    default: "0 mins"
  },
  categories: [{
    type: String
  }],
  likesCount: {
    type: Number,
    default: 0
  },
  commentsCount: {
    type: Number,
    default: 0
  },
  savesCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Add indexes
recipeSchema.index({ title: 'text' }); // Text index for search
recipeSchema.index({ categories: 1 });
recipeSchema.index({ createdAt: -1 });
recipeSchema.index({ likesCount: -1, savesCount: -1 });

module.exports = mongoose.model('Recipe', recipeSchema);
