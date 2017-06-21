var mongoose = require('mongoose');

var backgroundSchema = new mongoose.Schema({
    thumb: String,
    url: String,
    name: String
})

// Declare a model called Todo which was schema todoSchema
var Background = mongoose.model('Background', backgroundSchema);


// ================================================= //
// Seed data
// ================================================= //

var backgroundImages = [
    {
        thumb: 'images/backgrounds/default-thumb.jpg',
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
    // {
    //     thumb: 'images/backgrounds/snow-thumb.jpg',
    //     url: 'images/backgrounds/snow.jpg',
    //     name: 'snow'
    // },
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

for (b of backgroundImages) {  

    (function() {

        var thumb = b.thumb;
        var url = b.url;
        var name = b.name;

        Background.findOne({ name: b.name }, function(err, background) {
            if (err) throw err;

            if (!background) {
                // console.log(b);

                // Create a new user
                var newBackground = new Background({
                    thumb: thumb,
                    url: url,
                    name: name
                }); 

                // Save user 
                newBackground.save(function(err) {
                    if (err) { throw err; } 
                });  
            } 
        })
    })();
    
}


module.exports = Background;