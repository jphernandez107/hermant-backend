const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const models = require('../ORM/models');
const User = models.user;
const SALT_ROUNDS = 10;  // for bcrypt

const USER_NOT_FOUND = 'User not found.';
const INCORRECT_PASSWORD = 'Incorrect password.';
const USER_CREATED = 'User created successfully.';
const USER_UPDATED = 'User updated successfully.';
const USER_DELETED = 'User deleted successfully.';
const AUTHENTICATION_FAILED = 'Authentication failed.';

const getUsersList = async (req, res) => {
    try {
        const users = await User.findAll();
        if (!users) return res.status(404).send(USER_NOT_FOUND);
        return res.status(200).json(users);
    } catch (error) {
        catchError(res, error, USER_NOT_FOUND);
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).send(USER_NOT_FOUND);
        return res.status(200).json(user);
    } catch (error) {
        catchError(res, error, USER_NOT_FOUND);
    }
};

const createUser = async (req, res) => {
    try {
        let body = req.body;
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        body.password = await bcrypt.hash(body.password, salt);
        body.password_salt = salt;
        const user = await User.create(body);
        if (!user) return res.status(400).send('Error creating user.');
        return res.status(200).json({
            message: USER_CREATED,
            user: user,
        });
    } catch (error) {
        catchError(res, error, 'Error adding new user.');
    }
};

const updateUser = async (req, res) => {
    let body = req.body;
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).send(USER_NOT_FOUND);
        body.password = await bcrypt.hash(body.password, SALT_ROUNDS);
        await user.update(body);
        return res.status(200).json({
            message: USER_UPDATED,
            user: user,
        });
    } catch (error) {
        catchError(res, error, 'Error updating user.');
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).send(USER_NOT_FOUND);
        await user.destroy();
        return res.status(200).json({
            message: USER_DELETED,
            user: user,
        });
    } catch (error) {
        catchError(res, error, 'Error deleting user.');
    }
};

const loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ where: { dni: req.body.dni } });
        if (!user) return res.status(404).send(USER_NOT_FOUND);

        const passwordIsValid = await bcrypt.compare(req.body.password, user.password);
        if (!passwordIsValid) return res.status(400).send(INCORRECT_PASSWORD);

        user.last_login = new Date();
        await user.save();

        let token = jwt.sign({ id: user.id, role: user.role }, process.env.TOKEN_SECRET, { expiresIn: '8h' });
        delete user.dataValues.password
        delete user.dataValues.password_salt
        delete user.dataValues.password_reset_token
        delete user.dataValues.password_reset_token_expiry
        delete user.dataValues.updated_at
        delete user.dataValues.created_at
        delete user.dataValues.active
        return res.status(200).json({
            token: token,
            user: user,
        });
    } catch (error) {
        catchError(res, error, AUTHENTICATION_FAILED);
    }
};

const activateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).send(USER_NOT_FOUND);
        await user.update({ isActive: true });
        return res.status(200).json(user);
    } catch (error) {
        catchError(res, error, 'Error activating user.');
    }
};

const deactivateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).send(USER_NOT_FOUND);
        await user.update({ isActive: false });
        return res.status(200).json(user);
    } catch (error) {
        catchError(res, error, 'Error deactivating user.');
    }
};

function catchError(res, error, message) {
    console.log(error);
    res.status(400).json({
        message,
        error,
    });
}

const UserRole = Object.freeze({
    ADMIN: 0,
    ENGINEER: 1,
    MECHANIC: 2,
    // Add any other roles you need here
});

module.exports = {
    getUsersList,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    loginUser,
    activateUser,
    deactivateUser,
};
