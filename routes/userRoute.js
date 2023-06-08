const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { UserRole, verifyRole } = require('../middleware/jwtMiddleware');

// Get list of all users
router.get('/list', verifyRole(UserRole.ADMIN), userController.getUsersList);

// Create a new user
router.post('/register', verifyRole(UserRole.ADMIN), userController.createUser);

// Get details of a specific user
// router.get('/:id', userController.getUser);

// Update a specific user
router.put('/:id', verifyRole(UserRole.ADMIN), userController.updateUser);

// Delete a specific user
router.delete('/:id', verifyRole(UserRole.ADMIN), userController.deleteUser);

// User login
router.post('/signin', userController.loginUser);

// Reset a user's password
// router.put('/:id/reset-password', userController.resetPassword);

// Activate a user
router.put('/:id/activate', verifyRole(UserRole.ADMIN), userController.activateUser);

// Deactivate a user
router.put('/:id/deactivate', verifyRole(UserRole.ADMIN), userController.deactivateUser);

module.exports = router;