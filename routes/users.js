const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');
const { storeReturnTo } = require('../middleware')

const users = require('../controllers/users')

router.route('/register')
    .get(users.renderCreateForm)
    .post(catchAsync(users.createUser))

// router.get('/register', users.renderCreateForm)
// router.post('/register', catchAsync(users.createUser))

router.route('/login')
    .get(users.renderLoginForm)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)
// router.get('/login', users.renderLoginForm)
// router.post('/login', storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.login)

router.get('/logout', users.logout)

module.exports = router;
