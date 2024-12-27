const express = require("express");
const Router = express.Router();

const {
        handleGetAllUsers,
        handleCreateUser,
        handleGetUserById,
        handleUpdateUserById,
        handleDeleteUserById
} = require("../controllers/user")

const { authenticateToken } = require("../middlewares/index")

Router.route('/')
        .get(authenticateToken, handleGetAllUsers) // Get all users
        .post(handleCreateUser); // Register New User
        
Router.get('/:id', authenticateToken, handleGetUserById);

Router.route('/')
        .patch(authenticateToken, handleUpdateUserById) // Update user by id
        .delete(authenticateToken, handleDeleteUserById); // Delete user by id

module.exports = Router