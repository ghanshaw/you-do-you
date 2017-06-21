var express = require('express');
var router = express.Router();
var Background = require('../models/backgroundModel');

router.route('/') 

    .get(function(req, res) {
        
        Background.find(function(err, data) {
            if (err) {
                res.send(500, { message: 'Database error.' });
            }

            return res.send(data);
        });

    });

module.exports = router;




    // app.get('/api/setupTodos', function(req, res) {

    //     // Seed database
    //     var starterTodos = [
    //         {
    //             username: 'test',
    //             todo: 'Buy milk',
    //             isDone: false,
    //             hasAttachment: false
    //         },
    //         {
    //             username: 'test', 
    //             todo: 'Feed dog',
    //             isDone: false,
    //             hasAttachment: false
    //         },
    //         {
    //             username: 'test',
    //             todo: 'Learn node', 
    //             isDone: false,
    //             hasAttachment: false
    //         }
    //     ];

    //     Todos.create(starterTodos, function(err, results) {
    //         res.send(results);
    //     })

    // })