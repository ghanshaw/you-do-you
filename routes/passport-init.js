var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var User = require('../models/userModel');

// ================================================= //
// Passport Authentication
// ================================================= //

/*
* Functions serach for email and validate passwords.
* Done is a method called interally by the strategy 
* After authentication, returns to router for additional proccessing
*/

// Create registration Local Strategy
passport.use('register', new LocalStrategy({ 
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },

    function(req, email, password, done) {

        // Make name and password2 available to strategy
        var name = req.body.name;
        var password2 = req.body.password2;

        // Search DB for user
        User.findOne({ email: email }, function(err, user) {

            // Database error
            if (err) {
                return done(err, false);
            }
            // User already exists
            if (user) {
                return done(null, false, { message: 'Email already taken.' });
            }

            // Validate that passwords match
            if (password !== password2) {
                return done(null, false, { message: 'Passwords do not match.' });
            }

            // Create a new user
            var newUser = new User({
                name: name,
                email: email,
                password: createHash(password)
            });

            // Save user
            newUser.save(function callback(err) {
                if (err) {
                    return done(err, false);
                }

                console.log('Successfully registered ' +  email);
                return done(null, newUser);
            });        
        });
    }));


// Create login Local Strategy
passport.use('login', new LocalStrategy({  
        // By default, local strategy uses username and password, override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {

        // Search DB for user
        User.findOne({ email: email }, function(err, user) {

            // Database error
            if (err) {
                console.log ('Database error during login. ' + err);
                return done(err, false);
            }

            // User not found
            else if (!user) {
                return done(null, false, { message: 'User not found.' });
            }

            // Wrong password
            else if (!isValidPassword(user, password)) {
                return done(null, false, { message: 'Incorrect password. Please try again.' });
            }

            console.log('Successfully logged in as ' +  email);
            return done(null, user);
        });
    }));
            


// Serializing user for session
// Tell passport what to use as key
passport.serializeUser(function(user, done) {
    return done(null, user._id);
});


// Deserializing user for session
// Tell passport what to use as key
passport.deserializeUser(function(id, done) {

    User.findById(id, function(err, user) {
        if (err) {
            console.log ('Database error during deserialization. ' + err);
            return done(err, false);
        }
        else if (!user) {
            return done('User not found', false);
        }
        else {
            return done(null, user);
        }
    });
});

// Generates hash using bCrypt
var createHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// Confirm validity of password
var isValidPassword = function(user, password){
    return bcrypt.compareSync(password, user.password);
};

module.exports = passport;