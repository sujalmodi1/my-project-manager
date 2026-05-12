const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// This defines the /register part of the URL
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;