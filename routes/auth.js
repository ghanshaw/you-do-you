// ================================================= //
// Authentication API
// Delegates some responsibilty to passport-init
// ================================================= //

var express = require('express');
var router = express.Router();
var User = require('../models/userModel');
var Todo = require('../models/todoModel');
var passport = require('./passport-init');

// ================================================= //
// Logout (GET)
// ================================================= //

// Logout
router.get('/logout', function (req, res) {

    // Restore sample data if necessary
    if (req.query.sample) {
        // Restore sample user data
        User.restoreSampleData();

        // Restore sample todos
        Todo.restoreSampleData();
    }

    req.logout();
    res.status(200);
    res.json({ state: 'success', message: 'Successfully logged out' });
});

// ================================================= //
// Login/Register (POST)
// ================================================= //


// Handles login post
router.post('/login', function(req, res, next) {

    // Authenticate user using passport local strategy
    passport.authenticate('login', function(err, user, info) {
        successFailureHandler(req, res, next, err, user, info);    
    })(req, res, next);

});

// Handles register post
router.post('/register', function(req, res, next) {

    // Authenticate user using passport local strategy
    passport.authenticate('register', function(err, user, info) {
        successFailureHandler(req, res, next, err, user, info);    
    })(req, res, next);

});


// Callback on success/failure of authentication
var successFailureHandler = function(req, res, next, err, user, info) {

    // Database error
    if (err) { return res.json(err); }


    // User not found
    if (!user) { 
        info.success = false;
        return res.json(info); 
    }

    // Manually log user in with passport if successful
    req.logIn(user, function(err) {
    
        if (err) { return res.json(err); }

        // Generate JSON web token
        var token = req.user.generateJwt();

        // Create user object to send to client
        var user = {
            name: req.user.name,
            email: req.user.email,
            _id: req.user._id,
            settings: req.user.settings
        }

        // Send data to client
        res.json({ success: true, token : token, user: user, status: res.status });
    });
}

module.exports = router;