var mongoose = require('mongoose');
var config = require('../config');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');


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

userSchema.methods.generateJwt = function() {

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
// Restore Sample Data 
// ================================================= //

User.restoreSampleData = function() {

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



// User.createUser = function(newUser, callback) {

//     // Hash password, taken from docs
//     bcrypt.genSalt(10, function (err, salt) {
//         bcrypt.hash(newUser.password, salt, function (err, hash) {
//             newUser.password = hash;
//             newUser.save(callback);
//         });
//     });
// }

// User.hasUser

// // Retrieve user with email
// User.getUserByEmail = function(email, callback) {

//     var query = { email: email };
    

// }

// // Confirm submitted password
// User.comparePassword = function (candidatePwd, hash, callback) {
    
//     // Load hash from your password DB. 
//     bcrypt.compare(candidatePwd, hash, function (err, isMatch) {
//         if (err) throw err;
//         // Expects err as first arg if it exists; isMatch is boolean
//         callback(null, isMatch);
//     });
// }

// // Retrieve user with id
// User.getUserById = function(id, callback) {
//     User.findById(id, callback);
// };


// userSchema.methods.getBackgroundImage = function() {
//     return backgroundImages[this.settings.backgroundImage]
// }



