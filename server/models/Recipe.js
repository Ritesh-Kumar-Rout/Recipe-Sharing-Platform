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
  image: {
    type: String,
    required: true
  },
  ingredients: [{
    type: String,
    required: true
  }],
  steps: [{
    stepNumber: Number,
    description: String
  }],
  prepTime: {
    type: Number, // in minutes
    default: 0
  },
  cookTime: {
    type: Number, // in minutes
    default: 0
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

module.exports = mongoose.model('Recipe', recipeSchema);
