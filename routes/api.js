var express = require('express');
var router = express.Router();

var user = require('../controllers/user');

router.post('/register', (req, res, next) => {
	user.register(req.body.email, req.body.password, req.body.confirm, req.body.department)
		.then((data) => {
			res.status(200).json({data});
		})
		.catch((data) => {
			res.status(400).json({data});
		})
})

router.get('/registerVerify', (req, res, next) => {
	user.registerVerify(req.query.e, req.query.r)
		.then((data) => {
			res.status(200).json({data});
		})
		.catch((err) => {
			res.status(400).json({err});
		})
});

router.post('/login', (req, res, next) => {
	user.login(req.body.email, req.body.password, req.ip)
		.then((data) => {
			res.status(200).json({data});
		})
		.catch((err) => {
			res.status(400).json({err});
		})
});

module.exports = router;