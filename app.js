// ================================================= //
// Imports
// ================================================= //

// Express modules
var express = require('express');
var expressValidator = require('express-validator');
var session = require('express-session');
var favicon = require('serve-favicon');


// Middleware
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Mongoose
var mongo = require('mongodb');
var mongoose = require('mongoose');
var config = require('./config');

// Aquire routes
var api = require('./routes/api');
var auth = require('./routes/auth');

// Additional modules
var path = require('path');
var passport = require('passport');


// ================================================= //
// Init App
// ================================================= //

var app = express();

// ================================================= //
// Set View Engine
// ================================================= //

// Formally (no longer using server-side views)
// app.set('views', path.join(__dirname, 'views'));

// ================================================= //
// Middleware 
// ================================================= //

// Serve favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Automatically serves anything in the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express Sessions
var expressSecret = process.env.EXPRESS_SECRET || config.getExpressSessionSecret();
app.use(session({
    secret: expressSecret,
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

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

// Routing
app.use('/api', api);
app.use('/auth', auth);

// ================================================= //
// Set port
// ================================================= //

// Connect to database
var uristring = process.env.MONGODB_URI || config.getDbConnectionString();

mongoose.connect(uristring, function (err, res) {
  if (err) {
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + uristring);
  }
});

// Listen on port
app.set('port', (process.env.PORT || 8080));
app.listen(app.get('port'), function() {
    console.log('Server started on port ' + app.get('port'));
});