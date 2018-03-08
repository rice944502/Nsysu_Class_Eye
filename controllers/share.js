var {Users, Shares} = require('../models/index');
var secret = require('../config/secret');
var jwt = require('jwt-simple');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

var toShare = (user, year, department, classname, teachername, experience, getscore, coolscore, learnscore, recommendscore) => {
	//status: [0, 1, 2] => [success, input error, server error]
	return new Promise((resolve, reject) => {
		if (!year || !department || !classname || !teachername || !experience || !getscore || !coolscore || !learnscore || !recommendscore) {
			reject({status: 1, error: 'input error'});
		}
		var data = {
			editer: user,
			year: year,
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

var searchShare = (year, department, classname, teachername) => {
	//status: [0, 1] => [success, server error]
	return new Promise((resolve, reject) => {
		var searchData = {};
		if (year != 'all') {
			searchData.year = { [Op.like]: '%' + year + '%' };
		}
		if (department != 'all') {
			searchData.department = { [Op.like]: '%' + department + '%'};
		}
		if (classname) {
			searchData.classname = { [Op.like]: '%' + classname + '%' };
		}
		if (teachername) {
			searchData.teachername = { [Op.like]: '%' + teachername + '%' };
		}
		console.log(searchData)
		Shares.findAll({ where: searchData })
			.then((data) => {
				resolve({status: 0, data: data});
			})
			.catch((err) => {
				reject({status: 1, error: err});
			})
	})
};

module.exports = {
	toShare,
	searchShare
};