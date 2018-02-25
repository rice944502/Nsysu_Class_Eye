var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../config/global');

var callGetApi = (url) => {
  return new Promise((resolve, reject) => {
    request(config.host + url, (err, res, body) => {
      if (!err) {
        if (res.statusCode == 200) {
          resolve(body);
        } else {
          reject(body);
        }
      } else {
        reject(err);
      }
    })
  });
};

router.get('/', function(req, res, next) {
  res.render('index', { title: config.title });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: config.title });
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: config.title });
});

router.get('/search', async function(req, res, next) {
  try {
    var data = await callGetApi('classData');
    res.render('search', { title: config.title, data: JSON.parse(data) });
  } catch (error) {
    console.log(error);
  }
});

router.get('/share', async function(req, res, next) {
  var data = await callGetApi('classData');
  res.render('share', { title: config.title, data: JSON.parse(data), score: [config.score, config.assess] });
});

router.get('/question', function(req, res, next) {
  res.render('question', { title: config.title });
});

module.exports = router;
