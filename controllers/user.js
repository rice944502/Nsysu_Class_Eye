var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var bcrypt = require('bcrypt');
var {Users, Logins} = require('../models/index');
var config = require('../config/mail.json');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: config.gmail
});

var register = (email, password, confirmPassword, department) => {
	// status: [0, 1, 2, 3, 4] => ['success', 'input error', 'user exists ans was verify', 'user exists but no verify', 'server error']
	return new Promise((resolve, reject) => {
		if (!email || !password || !confirmPassword || !department) {
			reject({status: 1, error: 'input error'});
		}
		if (email.search(/^[A-Za-z][0-9]{9}$/) == -1 || password.search(/^[A-Za-z0-9]{8,20}$/) == -1 ||
				department.search(/^.{3,255}$/) == -1 || password != confirmPassword) {
			reject({status: 1, error: 'input error'});
		}
		email += '@student.nsysu.edu.tw';
		Users.findOne({ where: { email: email} })
			.then((data) => {
				if (data && data.state > 0) {
					reject({status: 2, error: 'user exists and was verify'});
				} else if (data && data.state == 0) {
					reject({status: 3, error: 'user exists but not verify'});
				} else {
					var userData = {
						email: email,
						password: bcrypt.hashSync(password, password.length),
						department: department,
						url: config.link + 'e=' + email + '&r=' + new Date().getTime()
					};
					sendMail(email, userData.url)
						.then(() => {
							Users.build(userData).save()
								.then(() => {
									resolve({status: 0})
								})
						})
						.catch((err) => {
							reject({status: 4, error: err})
						})
				}
			})
			.catch((err) => {
				reject({status: 4, error: err})
			})
	});
};

var sendMail = function(email, url) {
	return new Promise((resolve, reject) => {
		transporter.sendMail({
			from: config.gmail.user,
			to: email,
			subject: '中山課程眼註冊確認信',
			html: '<strong>此信為系統發出，請勿直接回覆</strong>' + 
				'<p>您好！歡迎您註冊中山選課眼，<br>這封信是由中山選課眼的會員註冊系統所寄出，<br>' +
				'請點選下面的網址來進行註冊的下一個步驟：</p>' +
				'<p><a href="' + url + '">' + url + '</a></p>' +
				'<p>如以上網址無法通過認證，請點選<a href="' + url + '">此處</a>。</p>' +
				'<p>*如果您不曾提出中山選課眼的註冊申請，請您直接刪除本信，抱歉造成您的困擾！<br>' +
				'*如果您無法連結信中網址，請以「註冊信連結失效」為主旨，附上您的學號，並寄至本信箱。</p>' +
				'<p>中山選課眼撰寫團隊 敬上</p>'
		}, function(err, info) {
			if (err) {
				reject(err);
			} else {
				resolve(info);
			}
		});
	});
};

module.exports = {
	register
};