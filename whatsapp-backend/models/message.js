const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User model
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User model
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat", // Optional: If you have a Chat model for group conversations
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    timestamps: {
      sentAt: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the model
const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
