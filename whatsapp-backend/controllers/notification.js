const Notification = require('../models/notifications');
const User = require('../models/user');

// Function to handle getting all notifications by user
const handleGetAllNotification = async (req, res) => {
    const userid = req.user.id;
    try {
        const allNotifications = await Notification.find({ userId: userid }).sort({createdAt: -1});
        return res.status(200).json(allNotifications);
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Function to handle adding a new notification
const handleAddNotification = async (req, res) => {
    const { receiverId, type, content } = req.body;
    const senderId = req.user.id;
    try {
        // Ensure sender exists
        const sender = await User.findById(senderId);
        if (!sender) {
            return res.status(404).json({ message: 'You are not valid user' });
        }
        const senderName = sender.name;
        // Ensure receiver exists
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({ message: 'Receiver User not found' });
        }

        // Ensure type is valid
        if (!['message', 'friend_request'].includes(type)) {
            return res.status(400).json({ message: 'Invalid notification type' });
        }

        // Ensure sender is not the receiver
        if (senderId === receiverId) {
            return res.status(400).json({ message: 'You cannot send a notification to yourself' });
        }

        if (type === 'friend_request') {
            // Ensure sender is not already friends with the receiver
            if (sender.friends.includes(receiverId)) {
                return res.status(400).json({ message: 'You are already friends with this user' });
            }

            // Ensure You have already sent a friend request to this user.
            const receiverFriendRequestsBySender = await Notification.findOne({
                userId: receiverId,
                type,
                'metadata.senderId': senderId, // Use dot notation to query nested fields
            });
            if (receiverFriendRequestsBySender) {
                return res.status(400).json({ message: 'You have already sent a friend request to this user.' });
            }

            // Ensure receiver has not already sent a friend request to the sender
            const senderFriendRequestsByReceiver = await Notification.findOne({
                userId: senderId,
                type,
                'metadata.senderId': receiverId, // Use dot notation to query nested fields
            });
            if (senderFriendRequestsByReceiver) {
                return res.status(400).json({ message: 'This user has already sent a friend request to you.' });
            }

            // Create and save the friend_request notification
            const notification = new Notification({
                userId: receiverId, // Example user ID
                type,
                content: "Send you a friend request.",
                metadata: { senderName, senderId, status: 'pending' },
            })
            const savedNotification = await notification.save();
            return res.status(200).json(savedNotification);
        } else {
            // Create and save the message notification
            const notification = new Notification({
                userId: receiverId, // Example user ID
                type,
                content,
                metadata: { senderName, senderId },
            })
            const savedNotification = await notification.save();
            return res.status(200).json(savedNotification);
        }
    } catch (err) {
        return res.status(400).json({ message: "Invalid Details", error: err.message });
    }
}

// Function to handle updating a notification
const handleUpdateNotification = async (req, res) => {
    const notificationId = req.params.id;
    const { status } = req.body;

    // Ensure type is valid
    if (!['accept', 'decline'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status type' });
    }

    try {
        // Get the notification
        const notification = await Notification.findById(notificationId);
        if (!notification) {
            return res.status(404).json({ message: "Notification Not Found" });
        }

        const receiver = await User.findById(notification.userId);
        if (!receiver) {
            return res.status(404).json({ message: "Receiver User not found" });
        }
        // Update user friends
        if (status === 'accept') {
            // Update both users' friends lists
            const updateFriends = await Promise.all([
                User.findByIdAndUpdate(
                    notification.userId,
                    { $addToSet: { friends: notification.metadata.senderId } }, // Add senderId to notification.userId's friends
                    { new: true } // Return the updated document
                ),
                User.findByIdAndUpdate(
                    notification.metadata.senderId,
                    { $addToSet: { friends: notification.userId } }, // Add userId to senderId's friends
                    { new: true } // Return the updated document
                ),
            ]);
            if (!updateFriends) {
                return res.status(404).json({ message: "Friends Not Added" });
            }
            // Update notification
            const updatedNotification = await Notification.findByIdAndUpdate(notificationId,
                {
                    userId: notification.metadata.senderId,
                    isRead: true,
                    content: `${receiver.name} accepted your friend request`,
                    metadata: {
                        senderName: receiver.name,
                        senderId: notification.userId,
                        status
                    }
                },
                { new: true }
            );
            res.status(200).json({ message: "Notification Updated", data: updatedNotification });
        } else {
            // Update notification
            const updatedNotification = await Notification.findByIdAndUpdate(notificationId,
                {
                    userId: notification.metadata.senderId,
                    isRead: true,
                    content: `${receiver.name} declined your friend request`,
                    metadata: {
                        senderName: receiver.name,
                        senderId: notification.userId,
                        status
                    }
                },
                { new: true }
            );
            res.status(200).json({ message: "Notification Updated", data: updatedNotification });
        }
    } catch (err) {
        return res.status(400).json({ message: "Notification Not Found", error: err.message });
    }
}

const handleDeleteNotification = async (req, res) => {
    const notificationId = req.params.id;
    try {
        const deletedNotification = await Notification.findByIdAndDelete(notificationId);
        if (!deletedNotification) {
            return res.status(404).json({ message: "Notification Not Found" });
        }
        res.status(200).json({ message: "Notification Deleted" });
    } catch (err) {
        return res.status(400).json({ message: "Invalid Details" });
    }
}

module.exports = {
    handleGetAllNotification,
    handleAddNotification,
    handleDeleteNotification,
    handleUpdateNotification
}