const express = require("express");
const Router = express.Router();

// Correct the way you import the controllers
const {
    handleGetAllNotification,
    handleAddNotification,
    handleDeleteNotification,
    handleUpdateNotification
} = require("../controllers/Notification");

// Ensure middleware is correctly imported
const { authenticateToken } = require("../middlewares/index");

// Define routes
Router.get('/', authenticateToken, handleGetAllNotification);
Router.post('/', authenticateToken, handleAddNotification);
Router.delete('/:id', authenticateToken, handleDeleteNotification);
Router.patch('/:id', authenticateToken, handleUpdateNotification);

module.exports = Router;
