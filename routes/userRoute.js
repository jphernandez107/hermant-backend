const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Get list of all users
router.get('/list', userController.getUsersList);

// Create a new user
router.post('/register', userController.createUser);

// Get details of a specific user
// router.get('/:id', userController.getUser);

// Update a specific user
router.put('/:id', userController.updateUser);

// Delete a specific user
router.delete('/:id', userController.deleteUser);

// User login
router.post('/signin', userController.loginUser);

// Reset a user's password
// router.put('/:id/reset-password', userController.resetPassword);

// Activate a user
router.put('/:id/activate', userController.activateUser);

// Deactivate a user
router.put('/:id/deactivate', userController.deactivateUser);

module.exports = router;