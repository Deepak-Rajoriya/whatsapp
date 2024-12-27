const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model
            required: true,
        },
        type: {
            type: String,
            enum: ['message', 'friend_request'], // Define different notification types
            required: true,
        },
        content: {
            type: String, // Details about the notification
            required: ()=>this.type === 'message',
        },
        isRead: {
            type: Boolean,
            default: false, // Whether the notification has been read
        },
        createdAt: {
            type: Date,
            default: Date.now, // Timestamp when the notification is created
        },
        metadata: {
            type: Object, // Additional data related to the notification
            default: {},
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
