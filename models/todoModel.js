// ================================================= //
// Todo Model
// ================================================= //

var mongoose = require('mongoose');

// ================================================= //
// Todo Schema
// ================================================= //

var todoSchema = new mongoose.Schema({
    user_id: String,
    email: String,
    text: String,
    isDone: {
        type: Boolean,
        default: false 
    },
    created_at: { 
        type: Date, 
        default: Date.now 
    },
    dueDate: {
        type: String,
        default: ''
    }
})

// Declare a model called Todo which was schema todoSchema
var Todo = mongoose.model('Todo', todoSchema);

// ================================================= //
// Restore todos of sample user
// ================================================= //

// Sample todos
var sampleTodos = [
        {
            "user_id": "594b3f45099d1920bc2d685f",
            "email": "peter.parker@email.com",
            "text": "Websling around New York",
            "dueDate": "",
            "created_at": {
                "$date": "2017-06-21T01:19:36.972Z"
            },
            "isDone": false,
        },
        {
            "user_id": "594b3f45099d1920bc2d685f",
            "email": "peter.parker@email.com",
            "text": "Take pictures for Daily Bugle",
            "dueDate": "Jul 13, 2017",
            "created_at": {
                "$date": "2017-06-21T01:19:48.606Z"
            },
            "isDone": true,
        },
        {
            "user_id": "594b3f45099d1920bc2d685f",
            "email": "peter.parker@email.com",
            "text": "Visit Mary Jane",
            "dueDate": "",
            "created_at": {
                "$date": "2017-06-21T01:32:02.190Z"
            },
            "isDone": true, 
        },
        {
            "user_id": "594b3f45099d1920bc2d685f",
            "email": "peter.parker@email.com",
            "text": "Defeat Dr. Octopus",
            "dueDate": "Nov 11, 2017",
            "created_at": {
                "$date": "2017-06-21T01:32:18.469Z"
            },
            "isDone": false,
        }
    ]

// Method to restore sample todos
Todo.restoreSampleData = function() {

    // Sample user's email
    var email = sampleTodos[0].email;

    // Remove all sample todos
    Todo.remove({
            email: email
        }, function(err) {
            if (err) { throw err; }

            // Read sample todos 
            for (t of sampleTodos) { 

                (function() {

                    // Store relevant details in closure
                    var id = t._id;
                    var user_id = t.user_id;
                    var email = t.email;
                    var text = t.text;
                    var dueDate = t.dueDate;
                    var isDone = t.isDone;
                    var created_at = t.created_at.$date;

                    // Create new todo from model
                    var newTodo = new Todo({
                        user_id: user_id,
                        email: email,
                        created_at: created_at,
                        text: text,
                        dueDate: dueDate,
                        isDone: isDone,
                    })

                    // Save todo, handle error, send response
                    newTodo.save(function(err, todo) {
                        if (err) { throw err; }
                    })
                })();
            }
        }
    );
}

module.exports = Todo;