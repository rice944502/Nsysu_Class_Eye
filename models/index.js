var Sequelize = require('sequelize');
var config = require('../config/database.json');

const sequelize = new Sequelize(config.database, config.username, config.password, {
	host: config.host,
	dialect: 'mysql',
	logging: false
});

module.exports = {
	sequelize
};