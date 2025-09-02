const express = require('express');
const { signup, login } = require('../controllers/authController');
const userValidationSchema = require('../utils/validation/user');
const validate = require('../middlewares/validate');

const router = express.Router();

// @route   POST /api/v1/auth/signup
// @desc    Register a new user
//          - It first validates the request body using the userValidationSchema.
//          - If validation passes, it proceeds to the signup controller.
router.post('/signup', validate(userValidationSchema), signup);

// @route   POST /api/v1/auth/login
// @desc    Logs in a user
router.post('/login', login);

module.exports = router;
