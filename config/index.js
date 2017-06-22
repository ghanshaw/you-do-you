// ================================================= //
// Config Object
// ================================================= //

var configObj = {}

// Try to access config file, if available
try {
    var configValues = require('./config');

    // Add methods to config object, if file is available
    configObj.getDbConnectionString = function() {
        return "mongodb://" + configValues.uname + ":" + configValues.pwd + "@ds123722.mlab.com:23722/node-youdoyou";
    };

    configObj.getExpressSessionSecret = function() {
        return configValues.expressSecret;
    };

    configObj.getJwtSecret = function() {
        return configValues.jwtSecret;
    };

} catch (ex) {}

module.exports = configObj;

