var express = require('express');
var router = express.Router();
var Todo = require('../models/todoModel');



// // Custom middleware
router.use('/todos', function(req, res, next) {

    // User is authenticated, redirect to login page
    if(!req.isAuthenticated()) {  
        console.log('user not authenticated')   
        return res.send({ message: 'User not authenticated '});
        return res.redirect('/'); 
        // return res.redirect('/#login');
    }
    // User is authenticated
    else {
        return next();
    }

});


router.route('/todos')

    // Get a todo
    .get(function(req, res) {
        
        Todo.find(function(err, data) {
            if (err) {
                res.send(500, { message: 'Database error.' });
            }

            return res.send(data);
        });

    })

    // Create a post
    .post(function(req, res) {
        // Get todo details from req object
        var text = req.body.text;
        var created_at = req.body.created_at;
        var email = req.body.email;

        // Create new todo from model
        var newTodo = new Todo({
            email: email,
            created_at: created_at,
            text: text
        })

        // Save todo, handle error, send response
        newTodo.save(function(err, todo) {
            if (err) {
                return res.send(500, err);
            }
            return res.json(todo);
        })
    });


router.route('/todos/:id') 

    // Return a particular post
    .get(function(req, res) {
 
        Todo.findById(req.params.id, function(err, todo) {
            if (err) {
                res.send(500, err);
            }
            else {
                res.json(todo)
            }
        })

    })

    // Update existing todo
    .put(function(req, res) {

        Todo.findById(req.params.id, function(err, todo) {
            if (err) {
                res.send(500, err);
            }

            // Update todo data
            todo.email = req.body.email;
            todo.text = req.body.text;
            todo.isDone = req.body.isDone;

            // Resave todo
            todo.save(function(err, todo) {
                if (err) {
                    res.send(500, err);
                }
                res.json(todo);
            })
        });
    })

    // Update existing todo
    .delete(function(req, res) {

        Todo.remove({
            _id: req.params.id
        }, function(err) {
            if (err) {
                res.status(500).send(err);
            }

                res.json('Deleted todo ' + req.params.id);
        }); 
    });





// // Get homepage
// router.get('/', function(req, res) {
//     res.send('Index page');
//     // console.log('Render index')
//     // res.render('layouts/index');
// });

// function ensureAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     else {
//         req.flash('error_msg', 'You are not logged in.');
//         res.redirect('/users/login');
//     }
// }

module.exports = router;