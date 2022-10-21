const express = require('express');
const { required } = require('joi');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const users = require('../controllers/users')
const catchAsync = require('../Utility/catchAsync');


router.route('/register')
    .get( users.registerForm )
    .post( catchAsync(users.postRegister));

router.route('/login')
    .get( users.loginForm)
    .post( passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.postLogin);

router.get('/logout',  users.Logout)

module.exports = router;