var Sequelize = require('sequelize');
var config = require('../config/database.json');

const sequelize = new Sequelize(config.database, config.username, config.password, {
	host: config.host,
	dialect: 'mysql',
	logging: false
});

const Users = sequelize.define('users', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	email: {
		type: Sequelize.STRING,
		unique: true
	},
	password: {
		type: Sequelize.STRING
	},
	department: {
		type: Sequelize.STRING
	},
	credit: {
		type: Sequelize.INTEGER
	},
	state: {
		type: Sequelize.INTEGER
	},
	url: {
		type: Sequelize.STRING
	},
	create_time: {
		type: Sequelize.DATE,
		defaultValue: Sequelize.NOW
	}
});

const Logins = sequelize.define('logins', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	email: {
		type: Sequelize.STRING
	},
	address: {
		type: Sequelize.STRING
	},
	create_time: {
		type: Sequelize.DATE,
		defaultValue: Sequelize.NOW
	}
});

const Shares = sequelize.define('shares', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	department: {
		type: Sequelize.STRING
	}, 
	classname: {
		type: Sequelize.STRING
	},
	teachername: {
		type: Sequelize.STRING,
	},
	experience: {
		type: Sequelize.STRING
	},
	getscore: {
		type: Sequelize.STRING
	},
	coolscore: {
		type: Sequelize.STRING
	},
	learnscore: {
		type: Sequelize.STRING
	},
	recommendscore: {
		type: Sequelize.STRING
	},
	editer: {
		type: Sequelize.STRING
	},
	like: {
		type: Sequelize.INTEGER
	},
	dislike: {
		type: Sequelize.INTEGER
	},
	visible: {
		type: Sequelize.INTEGER
	},
	post_date:  {
		type: Sequelize.DATE,
		defaultValue: Sequelize.NOW
	},
	update_date: {
		type: Sequelize.DATE,
		defaultValue: Sequelize.NOW
	}
});

const Questions = sequelize.define('questions', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	title: {
		type: Sequelize.STRING
	},
	content: {
		type: Sequelize.STRING
	},
	editer: {
		type: Sequelize.STRING
	},
	like: {
		type: Sequelize.INTEGER
	},
	dislike: {
		type: Sequelize.INTEGER
	},
	post_date:  {
		type: Sequelize.DATE,
		defaultValue: Sequelize.NOW
	},
	update_date: {
		type: Sequelize.DATE,
		defaultValue: Sequelize.NOW
	}
});

const Answers = sequelize.define('answers', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	questions: {
		type: Sequelize.INTEGER
	},
	content: {
		type: Sequelize.STRING
	},
	editer: {
		type: Sequelize.STRING
	},
	like: {
		type: Sequelize.INTEGER
	},
	dislike: {
		type: Sequelize.INTEGER
	},
	post_date:  {
		type: Sequelize.DATE,
		defaultValue: Sequelize.NOW
	},
	update_date: {
		type: Sequelize.DATE,
		defaultValue: Sequelize.NOW
	}
});

sequelize.sync();

module.exports = {
	sequelize,
	Users,
	Logins
};