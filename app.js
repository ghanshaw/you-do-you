// ================================================= //
// Imports
// ================================================= //

// Express modules
var express = require('express');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var session = require('express-session');


// Middleware
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Mongoose
var mongo = require('mongodb');
var mongoose = require('mongoose');
var config = require('./config');

var path = require('path');
var passport = require('passport');

// Aquire routes
var api = require('./routes/api');
var users = require('./routes/users')
var index = require('./routes/index')
var background = require('./routes/background')

// var LocalStrategy = require('passport-local').Strategy;

// ================================================= //
// Init App
// ================================================= //

var app = express();

// // Seed data
// var setupController = require('./controllers/setupController');

// // Add endpoint to seed data
// setupController(app);

// ================================================= //
// Set View Engine
// ================================================= //

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({ defaultLayout: 'layout' }));
app.set('view engine', 'handlebars');


// ================================================= //
// Middleware 
// ================================================= //

// Set static folder
// Automatically serves anything in the public folder
app.use(express.static(path.join(__dirname, 'public')));
// app.use(favicon(__dirname + '/public/favicon.ico'));
// app.use('/', static(__dirname + '/public'));

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express Sessions
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// var initPassport = require('./passport-init');
// initPassport(passport);

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;
 
    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
// app.use(flash());

// Global variables
// app.use(function(req, res, next) {
//     res.locals.success_msg = req.flash('success_msg');
//     res.locals.error_msg = req.flash('error_msg');
//     res.locals.error = req.flash('error');
//     res.locals.user = req.user || null;
//     next();
// });



// Routing
app.use('/', index);
app.use('/api', api);
app.use('/users', users);
app.use('/background', background);


// ================================================= //
// Set port
// ================================================= //

// Connect to database
mongoose.connect(config.getDbConnectionString());

// Listen on port
app.set('port', (process.env.PORT || 8080));
app.listen(app.get('port'), function() {
    console.log('Server started on port ' + app.get('port'));
});




var db = mongoose.connection;



// // Handles get requests for users
// app.get('/api/todos/:uname', function (req, res) {

//     // Analagous to an SQL query
//     Todos.find({
//         username: req.params.uname
//     }, function (err, todos) {
//         if (err) throw err;

//         res.send(todos);
//     })

// });

// // Handles get requests for individual ids
// app.get('/api/todo/:id', function (req, res) {

//     Todos.findById({
//         _id: req.params.id
//     }, function (err, todo) {
//         if (err) throw err;

//         res.send(todo);
//     })

// });

// app.post('/api/todo', function (req, res) {

//     // If post request has an id, update corresponding record
//     if (req.body.id) {
//         Todos.findByIdAndUpdate(req.body.id, {
//             todo: req.body.todo,
//             isDone: req.body.isDone,
//             hasAttachment: req.body.hasAttachment
//         }, function (err, todo) {
//             if (err) throw err;
//             res.send('Successfully updated record');
//         });
//     }

//     // Otherwise create new record
//     else {

//         var newTodo = Todos({
//             username: 'test',
//             todo: req.body.todo,
//             isDone: req.body.isDone,
//             hasAttachment: req.body.hasAttachment
//         });
//         newTodo.save(function (err) {
//             if (err) throw err;
//             res.send('Successfully created new record')
//         })
//     }
// });

// app.delete('/api/todo', function (req, res) {

//     Todos.findByIdAndRemove(req.body.id, function (err) {
//         if (err) throw err;
//         res.send('Successfully removed');
//     });

// })






// // Set up server side templating
// // app.set('view engine', 'ejs');

// //mongoose.connect('mongodb://localhost/loginapp');


// // Seed data
// var setupController = require('./controllers/setupController');



// // Setup API
// var apiController = require('./controllers/apiController');



// var port = process.env.PORT || 3000;





// // Register API endpoints
// apiController(app);






