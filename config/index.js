var configValues = require('./config');

module.exports = {
    getDbConnectionString: function() {
        return "mongodb://" + configValues.uname + ":" + configValues.pwd + "@ds123722.mlab.com:23722/node-youdoyou";
    }
}
