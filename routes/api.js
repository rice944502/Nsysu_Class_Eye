var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');

var secret = require('../config/secret.json');
var user = require('../controllers/user');
var	share = require('../controllers/share');

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

router.use((req, res, next) => {
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	if (token) {
		var decode = jwt.decode(token, secret.secret);
		if (decode.exp <= Date.now()) {
			return res.status(400).json({error: 'token has expired'});
		} else {
			req.body.user = decode.iss;
			next();
		}
	} else {
		return res.status(403).json({error: 'token not found'});
	}
});

router.post('/share', (req, res, next) => {
	//(user, department, classname, teachername, experience, getscore, coolscore, learnscore, recommendscore)
	share.toShare(req.body.user, req.body.department, req.body.classname, req.body.teachername, req.body.experience, req.body.getscore, req.body.coolscore, req.body.learnscore, req.body.recommendscore)
		.then((data) => {
			res.status(200).json({data});
		})
		.catch((err) => {
			res.status(400).json({err});
		})
})

// write function after that which need login

module.exports = router;