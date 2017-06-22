// ================================================= //
// User Model
// ================================================= //

var mongoose = require('mongoose');
var config = require('../config');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

// ================================================= //
// User Schema
// ================================================= //

var Schema = mongoose.Schema;

var userSchema = new Schema({
    password: {
        type: String
    },
    email: {
        type: String,
        index: true
    },
    name: {
        type: String
    },
    created_at: { 
        type: Date, 
        default: Date.now 
    },
    settings: {
        background: {
            type: String,
            default: 'default'
        } 
    }
})

// ================================================= //
// Additional User Methods
// ================================================= //

// Generate JSON Web Token
userSchema.methods.generateJwt = function() {

    // Get secrete from env variable or config file
    var jwtSecret = process.env.JWT_SECRET || config.getJwtSecret();
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
        settings: this.settings,
        exp: parseInt(expiry.getTime() / 1000),
    }, jwtSecret);

}

var User = mongoose.model('User', userSchema);

// ================================================= //
// Restore data of sample user
// ================================================= //

User.restoreSampleData = function() {

    // Details of sample user
    var sampleUser = {
        "_id": "5949c7b7f957694adcc50e1b",
        "name": "Peter Parker",
        "email": "peter.parker@email.com",
        "settings": {
            "background": "city"
        }
    }

    var id = sampleUser._id;

    User.findById(id, function(err, user) {

        if (err) throw err;

        // Restore background of sample user
        user.settings.background = sampleUser.settings.background;

        // Resave todo
        user.save(function(err, todo) {
            if (err) { throw err; }
        })
    });
};


module.exports = User