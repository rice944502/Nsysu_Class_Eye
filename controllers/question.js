var {Users, Questions, Answers} = require('../models/index');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

const askQuestion = (email, identity, title, content) => {
    // status = [0, 1] => [success, server error]
    return new Promise((resolve, reject) => {
        Users.findOne({ where: {email: email} })
            .then((user) => {
                let sendData = {
                    editer: email,
                    identity: identity,
                    title: title,
                    content: content
                };
                Questions.build(sendData).save()
                    .then((success) => {
                        resolve({status: 0});
                    })
                    .catch((err) => {
                        reject({status: 1, error: err});
                    })
            })
            .catch((err) => {;
                reject({status: 1, error: err})
            })
    });
}

const getQuestion = (title) => {
    // status: [0, 1] => [success, faild]
    return new Promise((resolve, reject) => {
        let search = {};
        search.title = { [Op.like]: '%' + (title ? title : '') + '%' };
        Questions.findAll({where: search})
            .then((data) => {
                resolve({ status: 0, data: data });
            })
            .catch((err) => {
                reject({ status: 1, error: err });
            })
    });
};

module.exports = {
    askQuestion,
    getQuestion
}