var express = require('express');
var router = express.Router();

var user = require('../controllers/user');

router.post('/register', (req, res, next) => {
	user.register(req.body.email, req.body.password, req.body.confirm, req.body.department)
		.then((data) => {
			console.log('0: ' + JSON.stringify(data));
		})
		.catch((data) => {
			console.log('e: ' + JSON.stringify(data))
		})
})

module.exports = router;