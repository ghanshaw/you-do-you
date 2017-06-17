var express = require('express');
var router = express.Router();
var User = require('../models/userModel');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


// ================================================= //
// Get Requests
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

// Login
router.get('/logout', function (req, res) {
    console.log('User logout');
    req.logout();
    req.flash('success_msg', 'You have logged out');

    // Redirect, not to a page, but to a route
    res.redirect('/users/login');
});

// ================================================= //
// Post Requests
// ================================================= //

// Register a new user
router.post('/register', function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    // Validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();
    console.log(errors)

    if (errors) {
        // Rerender form, and pass along errors
        res.render('layouts/register', {
            errors: errors
        });
    } else {

        var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        });

        // After instantiating a user, run this to hash password
        User.createUser(newUser, function (err, user) {
            if (err) throw err;
            console.log(newUser);
        });

        req.flash('success_msg', 'You are registered and can now log in');
        res.redirect('/users/login');
    }
});



// Searches for username, and validate password
// --> done is a method called interally by the strategy 
// redirects to other success/failure event handlers
passport.use(new LocalStrategy(
    function(username, password, done) {

        // Method on User model, created by developer (not built-in)
        User.getUserByUsername(username, function(err, user) {
            if (err) throw err;
            if (!user) {
               return done(null, false, { message: 'User not found.' });
            }
            // Method on User model, created by developer (not built-in)
            if (!User.comparePassword(password, user.password, function(err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Incorrect password. '});
                }
           }));
        });
    }));
            

passport.serializeUser(function(user, done) {
  done(null, user.id);
});


passport.deserializeUser(function(id, done) {

    // Method on User model, created by developer (not built-in)
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

// User Login
router.post('/login',

    // Passport authenticates using local strategy
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    }),

    // Callback upon successful login
    function (req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        res.redirect('/');
    });



module.exports = router;