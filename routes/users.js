const express = require('express');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync')
const router = express.Router({ mergeParams: true });
const passport = require('passport');
const users = require('../controllers/users');

router.route('/register')

    .get( users.renderRegisterForm)

    .post( users.register);


router.route('/login')

    .get( users.renderLogin)

    .post(passport.authenticate('local', {
        failureFlash: true,
        failureRedirect: '/login'
    }), users.login);


router.get('/logout', users.logout);

module.exports = router;