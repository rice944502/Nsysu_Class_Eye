var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../config/global');

var callGetApi = (url, sendData) => {
  return new Promise((resolve, reject) => {
    url += '?';
    for(var obj in sendData) {
      url += obj + '=' + sendData[obj] + '&';
    }
    request(config.host + url, (err, res, body) => {
      if (!err) {
        resolve({status: res.statusCode, body: body});
      } else {
        reject(err);
      }
    })
  });
};

var callPostApi = (url, sendData) => {
  return new Promise((resolve, reject) => {
    request.post({
      url: config.host + url,
      form: sendData
    }, (err, res, body) => {
      if (!err) {
        resolve({status: res.statusCode, body: body});
      } else {
        reject(err);
      }
    });
  });
};

router.get('/', function(req, res, next) {
  res.render('index', { title: config.title });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: config.title });
});

router.post('/login', async function(req, res, next) {
  var data = await callPostApi('login', req.body);
  res.json(data);
});

router.get('/logout', async function(req, res, next) {
  var data = await callGetApi('logout', req.query);
  res.json(data);
});

router.get('/register', async function(req, res, next) {
  var data = await callGetApi('departmentList');
  res.render('register', { title: config.title, department: JSON.parse(data.body) });
});

router.post('/register', async function(req, res, next) {
  var data = await callPostApi('register', req.body);
  if (data.status == 200) {
    res.redirect('/login');
  } else {
    res.redirect('/register');
  }
});

router.get('/registerVerify', async function(req, res, next) {
  var data = await callGetApi('registerVerify', req.query);
  if (data.status == 200) {
    res.redirect('/login');
  } else {
    res.redirect('/register');
  }
});

router.get('/search', async function(req, res, next) {
  var data = await callGetApi('classData');
  res.render('search', { title: config.title, data: JSON.parse(data.body) });
});

router.get('/share', async function(req, res, next) {
  var data = await callGetApi('classData');
  res.render('share', { title: config.title, data: JSON.parse(data.body), score: [config.score, config.assess] });
});

router.get('/ask', function(req, res, next) {
  res.render('ask', { title: config.title });
});

router.post('/ask', function(req, res, next) {
  // TODO
  res.redirect('/question');
});

router.get('/question', function(req, res, next) {
  // TODO
  res.render('question', { title: config.title });
});

router.post('/question', function(req, res, next) {
  // TODO
  res.redirect('/question');
})

module.exports = router;
