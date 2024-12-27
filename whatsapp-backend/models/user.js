const mongoose = require("mongoose");

// Define the schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [
      /^[a-z0-9._]+$/, // Regular expression to validate the username
      'Username must only contain lowercase letters, numbers, dots (.), and underscores (_), without spaces or special characters.',
    ],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  usermeta: {
    type: mongoose.Schema.Types.Mixed, // Allows for flexible key-value pairs
    default: {},
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId, // Reference to User model
      ref: 'User',
    },
  ],
  chats: [
    {
      type: mongoose.Schema.Types.ObjectId, // Reference to User model
      ref: 'Chat',
    },
  ],
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

// Create the model
const User = mongoose.model('Users', UserSchema);

// Export the model
module.exports = User;