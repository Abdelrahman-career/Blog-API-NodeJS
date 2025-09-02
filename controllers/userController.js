const User = require('../models/user');
const Post = require('../models/post');
const AppError = require('../utils/AppError');

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({
            status: 'success',
            results: users.length,
            data: {
                users
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get a single user by ID
// @route   GET /api/v1/users/:id
// @access  Private
exports.getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(new AppError('No user found with that ID', 404));
        }
        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        });
    } catch (error) {
        next(error);
    }
};


// @desc    Delete a user and all their posts (Hard Delete)
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        // 1. Delete all posts by this user
        await Post.deleteMany({ authorId: userId });

        // 2. Delete the user
        await User.findByIdAndDelete(userId);

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        next(error);
    }
};