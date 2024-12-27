const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Assuming you have a User model
        required: true,
      },
    ],
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    groupName: {
      type: String,
      trim: true,
      required: function () {
        return this.isGroupChat;
      },
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Only applicable for group chats
      required: function () {
        return this.isGroupChat;
      },
    },
    lastMessage: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the model
const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;