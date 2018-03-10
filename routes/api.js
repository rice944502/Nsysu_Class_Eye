var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');

var secret = require('../config/secret.json');
var user = require('../controllers/user');
var	share = require('../controllers/share');
var spider = require('../controllers/spider');
var question = require('../controllers/question');

router.post('/register', (req, res, next) => {
	user.register(req.body.email, req.body.password, req.body.confirm, req.body.department, req.body.nickname)
		.then((data) => {
			res.status(200).json({data});
		})
		.catch((data) => {
			res.status(400).json({data});
		})
});

router.get('/departmentList', (req, res, next) => {
	spider.getDeparmentList
		.then((data) => {
			res.status(200).json(data);
		})
		.catch((err) => {
			res.status(400).json({err});
		})
});

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
			res.status(200).json(data);
		})
		.catch((err) => {
			res.status(400).json({err});
		})
});

router.get('/classData', (req, res, next) => {
	spider.getClassData
		.then((data) => {
			res.status(200).json(data);
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

router.get('/logout', (req, res, next) => {
	user.logout(req.body.user);
	res.status(200).json('ok');
});

router.get('/share', (req, res, next) => {
	share.searchShare(req.query.year, req.query.department, req.query.classname, req.query.teachername)
		.then((result) => {
			res.status(200).json(result.data)
		})
		.catch((err) => {
			res.status(400).json({err})
		})
});

router.post('/share', (req, res, next) => {
	//(user, department, classname, teachername, experience, getscore, coolscore, learnscore, recommendscore)
	share.toShare(req.body.user, req.body.year, req.body.department, req.body.classname, req.body.teachername, req.body.experience, req.body.getscore, req.body.coolscore, req.body.learnscore, req.body.recommendscore)
		.then((data) => {
			res.status(200).json({data});
		})
		.catch((err) => {
			res.status(400).json({err});
		})
});

router.get('/question', async (req, res, next) => {
	try {
		let data = await question.getQuestion(req.query.title);
		res.status(200).json({data});
	} catch(err) {
		res.status(400).json({err});
	}
});

router.post('/ask', (req, res, next) => {
	question.askQuestion(req.body.user, req.body.identity, req.body.title, req.body.content)
		.then((data) =>{
			res.status(200).json({data});
		})
		.catch((err) => {
			res.status(400).json({err});
		})
})

module.exports = router;