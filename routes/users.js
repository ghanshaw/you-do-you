var express = require('express');
var router = express.Router();
var User = require('../models/userModel');
var Todo = require('../models/todoModel');
var passport = require('./passport-init');

// ================================================= //
// Get Requests (pages themselves)
// ================================================= //


// // Register
// router.get('/register', function (req, res) {
//     res.render('layouts/register');
// });

// // Login
// router.get('/login', function (req, res) {
//     console.log('Render login');
//     res.render('layouts/login');
// });


// Logout
router.get('/logout', function (req, res) {

    // console.log(req.query);

    // Revert to sample data if possible
    if (req.query.sample) {
        console.log('restoring sample data');
        User.restoreSampleData();

        // Restore todos
        Todo.restoreSampleData();
    }

    console.log('User logout');
    req.logout();
    res.status(200);
    res.json({ state: 'success', message: 'Successfully logged out' });
    // return res.redirect('/');
    // req.flash('success_msg', 'You have logged out');

    // Redirect, not to a page, but to a route
    // res.redirect('/users/login');
});

router.get('/success', function(req, res) {
    console.log('SUCCESS')
    // Generate JWT
    var token = req.user.generateJwt();

    // Create user object to send to client
    var user = {
        name: req.user.name,
        email: req.user.email,
        _id: req.user._id,
        settings: req.user.settings
    }

    res.json({ state: 'success', token : token, user: user, status: res.status });
})

router.get('/failure', function(req, res) {
    console.log('FAILURE');

    // Create user object to send to client
    var user = null;
    if (req.user) {
        user = {
            name: req.user.name,
            email: req.user.email,
            _id: req.user._id,
            settings: req.user.settings
        }
    }
    console.log(res.authInfo);
    console.log(req.authInfo);
    console.log(req.loginMessage);
    // console.log(req);
    console.log(res);

    res.send({ state: 'failure', message: res.message });
})




// ================================================= //
// Post Requests
// ================================================= //

//===============PASSPORT=================

// Register a new user
// router.post('/register',

//     // // Passport authenticates using local strategy
//     passport.authenticate('register', {
//         successRedirect: '/users/success',
//         failureRedirect: '/users/failure'
//     }));

   
// var loginPassport = function(req, res, next) {

//     // console.log('aksdjlfjasdf');

//     // Callback upon successful login
//     passport.authenticate('login', {}, 
//         function (err, user, info) {

//             console.log(err, user, info);
//             if (err) {
//                 return res.status(500).json(err);
//             }
//             if (!user) {
//                 return res.status(400).json(info);
//             }
//             if (user) {
//                 // Generate JWT
//                  var token = req.user.generateJwt();

//                 // Create user object to send to client
//                 var user = {
//                     name: req.user.name,
//                     email: req.user.email,
//                     _id: req.user._id,
//                     settings: req.user.settings
//                 }

//                 return res.json({ state: 'success', token : token, user: user, status: res.status });
//             }
//         })
// };

var successFailureHandler = function(req, res, next, err, user, info) {

    if (err) { return res.json(err); }

    if (!user) { 
        info.success = false;
        return res.json(info); 
    }

    req.logIn(user, function(err) {

      if (err) { return res.json(err); }

      console.log('SUCCESS')
        // Generate JWT
        var token = req.user.generateJwt();

        // Create user object to send to client
        var user = {
            name: req.user.name,
            email: req.user.email,
            _id: req.user._id,
            settings: req.user.settings
        }

        res.json({ success: true, token : token, user: user, status: res.status });

    });

}

router.post('/login', function(req, res, next) {

  passport.authenticate('login', function(err, user, info) {

    successFailureHandler(req, res, next, err, user, info);    

  })(req, res, next);

});

router.post('/register', function(req, res, next) {

  passport.authenticate('register', function(err, user, info) {

    successFailureHandler(req, res, next, err, user, info);    

  })(req, res, next);

});


// // User Login
// router.post('/login', loginPassport);

    



    // passport.authenticate('login', {
    //     successRedirect: '/users/success',
    //     failureRedirect: '/users/failure'
    // }));

    
        //     console.log(info);

        //  console.log('Login failed or succeeded');
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        // res.redirect('/');
    // }));


    // passport.authenticate('login'),
    
    // function(req, res) {
    //     console.log('kajdskfjaksfd');
    //     console.log(req.authInfo)
    // });

    // // Passport authenticates using local strategy
    // passport.authenticate('login'), function (req, res) {

    //      console.log('Stop redirecting');
    //     //  console.log(res);
    //     // If this function gets called, authentication was successful.
    //     // `req.user` contains the authenticated user.
    //     return res.json({ message: 'Successful login again'});
    //     //res.redirect('/');
    // });



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