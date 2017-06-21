var express = require('express');
var router = express.Router();

/* Get home page. */
router.get('/', function(req, res, next) {
    console.log('Render this');
    res.render( 'layouts/index', { title: "YouDoYou" })
})

module.exports = router;