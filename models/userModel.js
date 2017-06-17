var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    name: {
        type: String
    }
})

var User = mongoose.model('User', userSchema);

User.createUser = function(newUser, callback) {

    // Hash password, taken from docs
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });

}

// Retrieve user with username
User.getUserByUsername = function(username, callback) {

    var query = { username: username };
    User.findOne(query, callback);

}

// Confirm submitted password
User.comparePassword = function (candidatePwd, hash, callback) {
    
    // Load hash from your password DB. 
    bcrypt.compare(candidatePwd, hash, function (err, isMatch) {
        if (err) throw err;
        // Expects err as first arg if it exists; isMatch is boolean
        callback(null, isMatch);
    });
}

// Retrieve user with id
User.getUserById = function(id, callback) {
    User.findById(id, callback);
};

module.exports = User



