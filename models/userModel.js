var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

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

User.hasUser

// Retrieve user with email
User.getUserByEmail = function(email, callback) {

    var query = { email: email };
    

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



