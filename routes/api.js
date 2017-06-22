// ================================================= //
// Todos and User API
// ================================================= //

var express = require('express');
var router = express.Router();
var Todo = require('../models/todoModel');
var User = require('../models/userModel');


// ================================================= //
// Custom Authentication Middleware
// ================================================= //


// Custom middleware -- Stop user if not authenticated
router.use('/todos', function(req, res, next) {

    // User is authenticated, redirect to login page
    if(!req.isAuthenticated()) {  
        console.log('user not authenticated')   
        res.status(401);
        return res.json({ message: 'User not authenticated.'});
    }
    // User is authenticated
    else {
        return next();
    }
});


// ================================================= //
// /todos -- All todos
// ================================================= //

// Get all todos, create new todo
router.route('/todos')

    // Get all todos
    .get(function(req, res) {
        
        Todo.find(function(err, data) {
            if (err) {
                res.send(500, { message: 'Database error.' });
            }

            return res.send(data);
        });

    })

    // Create a todo
    .post(function(req, res) {

        // Get todo details from req object
        var text = req.body.text;
        var created_at = req.body.created_at;
        var user_id = req.body.user_id;
        var email = req.body.email;

        // Create new todo from model
        var newTodo = new Todo({
            user_id: user_id,
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


// ================================================= //
// /todos/:id -- Get todo by id
// ================================================= //

// CRUD todos by id
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


// ================================================= //
// /user/:user_id/todos -- Get todos by user
// ================================================= //


// Get all todos belonging to specific user
router.route('/user/:user_id/todos')

    // Return all todos belonging to one person
    .get(function(req, res) {
 
        Todo.find({ user_id: req.params.user_id }, function(err, todo) {
            if (err) {
                res.send(500, err);
            }
            else {
                res.json(todo)
            }
        })
    })

    // Create a new todo for a given user
    .post(function(req, res) {

        // Get todo details from req object
        var text = req.body.text;
        var created_at = req.body.created_at;
        var user_id = req.body.user_id;
        var email = req.body.email;

        // Create new todo from model
        var newTodo = new Todo({
            user_id: user_id,
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
    })

    // Delete all todos belonging to a given user
    .delete(function(req, res) {

        // Get todo details from req object
        var text = req.body.text;
        var created_at = req.body.created_at;
        var user_id = req.body.user_id;
        var email = req.body.email;

        // Create new todo from model
        var newTodo = new Todo({
            user_id: user_id,
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
    })


// ================================================= //
// /user/:user_id/todos/:todo_id -- Get specific todos by user
// ================================================= //

// CRUD individual todo belonging to specific user
router.route('/user/:user_id/todos/:todo_id')

    // Return all todos belonging to one person
    .get(function(req, res) {
 
        Todo.find({ 
            user_id: req.params.user_id,
            _id: req.params.todo_id
        }, function(err, todo) {
            if (err) {
                res.send(500, err);
            }
            else {
                res.json(todo[0])
            }
        })
    })

    // Update existing todo
    .put(function(req, res) {

        Todo.find({ 
            user_id: req.params.user_id,
            _id: req.params.todo_id
        }, function(err, todo) {
            if (err) {
                res.send(500, err);
            }

            // Update todo data
            todo[0].text = req.body.text;
            todo[0].isDone = req.body.isDone;
            todo[0].dueDate = req.body.dueDate;

            // Resave todo
            todo[0].save(function(err, todo) {
                if (err) {
                    res.send(500, err);
                }
                res.json(todo);
            })
        })
    })

    // Update existing todo
    .delete(function(req, res) {

        Todo.remove({
            user_id: req.params.user_id,
            _id: req.params.todo_id
        }, function(err, todo) {
            if (err) {
                res.status(500).send(err);
            }
                res.json('Deleted todo ' + req.params.todo_id);
        }); 
    });

// ================================================= //
// /user/:user_id/ -- Update User
// ================================================= //

    
// Update specific user
router.route('/user/:user_id')

    .put(function(req, res) {

        var user_id = req.params.user_id;
 
        User.findById(user_id, function(err, user) {
            if (err) {
                return res.send(500, err);
            }

            if (!user) {
                return res.send(500, err);
            }

            // Update background associated with user
            var backgroundName = req.body.backgroundName;
            user.settings.background = backgroundName;

            // Resave user
            user.save(function(err, user) {
                if (err) {
                    res.send(500, err);
                }
                return res.status(200).json({ 'message' : 'User updated.' , user: user });
            })
        })
    })


module.exports = router;