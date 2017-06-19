var mongoose = require('mongoose');

var todoSchema = new mongoose.Schema({
    email: String,
    text: String,
    isDone: {
        type: Boolean,
        default: false 
    },
    created_at: { 
        type: Date, 
        default: Date.now 
    }
})

// Declare a model called Todo which was schema todoSchema
var Todos = mongoose.model('Todo', todoSchema);

module.exports = Todos;