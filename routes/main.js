var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../config/global');

var callGetApi = (url, sendData) => {
  return new Promise((resolve, reject) => {
    request(config.host + url, { qs: sendData }, (err, res, body) => {
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

router.use((req, res, next) => {
	if (req.headers['cookie']) {
    var cookie = req.headers['cookie'];
    cookie = cookie.split(';');
    for(var i=0; i<cookie.length; i++) {
      if (cookie[i].substr(0, cookie[i].search('=')) == 'x-access-token') {
        token = cookie[i].substr(cookie[i].search('=') + 1);
        break;
      }
    }
    req.body.token = req.query.token = token;
  }
  next();
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: config.title });
});

router.post('/login', async function(req, res, next) {
  var data = await callPostApi('login', req.body);
  res.cookie('x-access-token', JSON.parse(data.body).token, {maxAge: 60 * 1000 * 10});
  res.json(data);
});

router.get('/logout', async function(req, res, next) {
  var data = await callGetApi('logout', req.query);
  res.clearCookie('x-access-token');
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
  try {
    var data = await callGetApi('classData');
    if (req.body.token) {
      res.render('search', { title: config.title, data: JSON.parse(data.body) });
    } else {
      res.render('search', { title: config.title, error: '尚未登入或過久未進行操作！'});
    }
  } catch (err) {
    res.render('search', { title: config.title, error: '學校網站掛惹，不要找我QQ' });
  }
});

router.get('/searchClass', async function(req, res, next) {
  try {
    var classData = await callGetApi('classData');
    var searchData = await callGetApi('share', req.query);
    if (searchData.status == 200) {
      res.render('search', { title: config.title, data: JSON.parse(classData.body), searchData: JSON.parse(searchData.body) });
    } else if (searchData.status == 403) {
      res.render('search', { title: config.title, data: JSON.parse(classData.body), error: '尚未登入或過久未進行操作！' });
    } else {
      res.render('search', { title: config.title, data: JSON.parse(classData.body), error: '操作失敗！請稍後再試！' });
    }
  } catch (err) {
    res.render('search', { title: config.title, error: '學校網站掛惹，不要找我QQ' });
  }
});

router.get('/share', async function(req, res, next) {
  try {
    var data = await callGetApi('classData');
    res.render('share', { title: config.title, data: JSON.parse(data.body), score: [config.score, config.assess] }); 
  } catch(err) {
    res.render('share', { title: config.title, error: '學校網站掛惹，不要找我QQ' });
  }
});

router.post('/shareClass', async function(req, res, nex) {
  var data = await callPostApi('share', req.body);
  res.json(data);
})

router.get('/ask', function(req, res, next) {
  res.render('ask', { title: config.title });
});

router.post('/ask', async function(req, res, next) {
  let data = await callPostApi('ask', req.body);
  res.redirect('/question');
});

router.get('/question', async function(req, res, next) {
  let data = await callGetApi('question', req.query);
  if (data.status == 200) {
    res.render('question', { title: config.title, data: JSON.parse(data.body).data.data });
  } else if (data.status == 403) {
    res.render('question', { title: config.title, error: '尚未登入或過久未進行操作！' });
  } else {
    res.render('question', { title: config.title, error: '操作失敗！請稍後再試！' });
  }
});

module.exports = router;
