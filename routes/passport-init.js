var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var User = require('../models/userModel');
// var Todo = require('../models/todoModel');

// var users =  {};

passport.use('register', new LocalStrategy({ 
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },

    function(req, email, password, done) {

        // Make name available to strategy
        var name = req.body.name;
        // var email = req.body.email;
        // var password = req.body.password;
        // var password2 = req.body.password2;


        User.findOne({ email: email }, function(err, user) {

            // Database error
            if (err) {
                return done(err, false);
            }
            // User already exists
            else if (user) {
                return done('Email already taken', false);
            }

            // Validate that passwords match
            // req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

            // Create a new user
            var newUser = new User({
                name: name,
                email: email,
                password: createHash(password)
            });

            // Save user
            newUser.save(function(err) {
                if (err) {
                    return done(err, false);
                }

                console.log('Successfully registered ' +  email);
                return done(null, user);
            });        
        });
    }));


// Searches for email and validates password
// --> done is a method called interally by the strategy 
// redirects to other success/failure event handlers
passport.use('login', new LocalStrategy({  
        // By default, local strategy uses username and password, override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {

        User.findOne({ email: email }, function(err, user) {
            // Database error
            if (err) {
                return done(err, false);
            }

            // User not found
            else if (!user) {
                return done('User not found.', false);
            }

            // Wrong password
            else if (!isValidPassword(user, password)) {
                return done('Incorrect password.', false);
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





    // // Validation
    // req.checkBody('name', 'Name is required').notEmpty();
    // req.checkBody('email', 'Email is required').notEmpty();
    // req.checkBody('email', 'Email is not valid').isEmail();
    // req.checkBody('username', 'Username is required').notEmpty();
    // req.checkBody('password', 'Password is required').notEmpty();
    // req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    // var errors = req.validationErrors();
    // console.log(errors)

    // if (errors) {
    //     // Rerender form, and pass along errors
    //     res.render('layouts/register', {
    //         errors: errors
    //     });
    // } else {

        

    //     // After instantiating a user, run this to hash password
    //     User.createUser(newUser, function (err, user) {
    //         if (err) throw err;
    //         console.log(newUser);
    //     });

    //     req.flash('success_msg', 'You are registered and can now log in');
    //     res.redirect('/users/login');
    // }








    //         return done('we have not implemented this', false);

    //     })
    // );


        // // Method on User model, created by developer (not built-in)
        // User.getUserByUsername(username, function(err, user) {
            

        //     // Check if user exists
        //     if (!user) {
        //        return done(null, false, { message: 'User not found.' });
        //     }

        //     // Check password
        //     // Method on User model, created by developer (not built-in)
        //     if (!User.comparePassword(password, user.password, function(err, isMatch) {
        //         if (err) throw err;

        //         // Login successful
        //         if (isMatch) {
        //             return done(null, user);
        //         } 
        //         // Login unsuccessful
        //         else {
        //             return done(null, false, { message: 'Incorrect password.'});
        //         }
        //    }));
        // });

// // Method on User model, created by developer (not built-in)
//     User.getUserById(id, function(err, user) {
//         done(err, user);
//     });