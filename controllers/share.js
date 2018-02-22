var {Users, Shares} = require('../models/index');
var secret = require('../config/secret');
var jwt = require('jwt-simple');

var toShare = (user, department, classname, teachername, experience, getscore, coolscore, learnscore, recommendscore) => {
	//status: [0, 1, 2] => [success, input error, server error]
	return new Promise((resolve, reject) => {
		if (!department || !classname || !teachername || !experience || !getscore || !coolscore || !learnscore || !recommendscore) {
			reject({status: 1, error: 'input error'});
		}
		var data = {
			editer: user,
			department: department,
			classname: classname,
			teachername: teachername,
			experience: experience,
			getscore: getscore,
			coolscore: coolscore,
			learnscore: learnscore,
			recommendscore: recommendscore
		};
		Shares.build(data).save()
			.then(() => {
				resolve({status: 0});
			})
			.catch((err) => {
				reject({status: 2, error: err});
			})
	})
}

module.exports = {
	toShare
};