var express = require('express');
var router = express.Router();
var User = require('../models/userModel');
var passport = require('./passport-init');

// ================================================= //
// Get Requests (pages themselves)
// ================================================= //


// Register
router.get('/register', function (req, res) {
    res.render('layouts/register');
});

// Login
router.get('/login', function (req, res) {
    console.log('Render login');
    res.render('layouts/login');
});

// Logout
router.get('/logout', function (req, res) {
    console.log('User logout');
    req.logout();
    req.flash('success_msg', 'You have logged out');

    // Redirect, not to a page, but to a route
    res.redirect('/users/login');
});

router.get('/success', function(req, res) {
    res.send({state: 'success', user: req.user ? req.user : null});
})

router.get('/failure', function(req, res) {
    res.send({state: 'failure', user: req.user ? req.user : null});
})




// ================================================= //
// Post Requests
// ================================================= //

//===============PASSPORT=================

// Register a new user
router.post('/register',

    // Passport authenticates using local strategy
    passport.authenticate('register', {
        successRedirect: '/users/success',
        failureRedirect: '/users/register'
    }),

    // Callback upon successful login
    function (req, res) {

         console.log('Attempted to register');
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        res.redirect('/');
    });



// User Login
router.post('/login',

    // Passport authenticates using local strategy
    passport.authenticate('login', {
        successRedirect: '/users/success',
        failureRedirect: '/users/login'
    }),

    // Callback upon successful login
    function (req, res) {

         console.log('Attempted to login');
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        res.send({ message: 'Successful login '});
        //res.redirect('/');
    });



module.exports = router;


// router.post('/register', function (req, res) {
//     var name = req.body.name;
//     var email = req.body.email;
//     var password = req.body.password;
//     var password2 = req.body.password2;

//     // Validation
//     req.checkBody('name', 'Name is required').notEmpty();
//     req.checkBody('email', 'Email is required').notEmpty();
//     req.checkBody('email', 'Email is not valid').isEmail();
//     req.checkBody('username', 'Username is required').notEmpty();
//     req.checkBody('password', 'Password is required').notEmpty();
//     req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

//     var errors = req.validationErrors();
//     console.log(errors)

//     if (errors) {
//         // Rerender form, and pass along errors
//         res.render('layouts/register', {
//             errors: errors
//         });
//     } else {

//         var newUser = new User({
//             name: name,
//             email: email,
//             password: password
//         });

//         // After instantiating a user, run this to hash password
//         User.createUser(newUser, function (err, user) {
//             if (err) throw err;
//             console.log(newUser);
//         });

//         req.flash('success_msg', 'You are registered and can now log in');
//         res.redirect('/users/login');
//     }
// });