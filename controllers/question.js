var {Users, Questions, Answers} = require('../models/index');

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
                console.log(sendData)
                Questions.build(sendData).save()
                    .then((success) => {
                        resolve({status: 0});
                    })
                    .catch((err) => {
                        reject({status: 1, error: err});
                    })
            })
            .catch((err) => {
                reject({status: 1, error: err})
            })
    });
}

module.exports = {
    askQuestion
}