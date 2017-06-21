var Todos = require('../models/todoModel')

module.exports = function(app) {

    app.post('/api/backgrounds', function(req, res) {

        var backgroundImages = [
            {
                thumb: 'images/background/default.jpg',
                name: 'default'
            },
            {
                thumb: 'images/backgrounds/city-thumb.jpg',
                url: 'images/backgrounds/city.jpg',
                name: 'city'
            },
            {
                thumb: 'images/backgrounds/lake-thumb.jpg',
                url: 'images/backgrounds/lake.jpg',
                name: 'lake'
            },
            {
                thumb: 'images/backgrounds/rockies-thumb.jpg',
                url: 'images/backgrounds/rockies.jpg',
                name: 'rockies'
            },
            {
                thumb: 'images/backgrounds/snow-thumb.jpg',
                url: 'images/backgrounds/snow.jpg',
                name: 'snow'
            },
            {
                thumb: 'images/backgrounds/space-thumb.jpg',
                url: 'images/backgrounds/space.jpg',
                name: 'space'
            },
            {
                thumb: 'images/backgrounds/waterfall-thumb.jpg',
                url: 'images/backgrounds/waterfall.jpg',
                name: 'waterfall'
            },
        ]

        Background.create(backgroundImages, function(err, results) {
            res.send(results);
        })

    })
};



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