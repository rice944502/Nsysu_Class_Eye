var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');

var getClassData = new Promise(function(resolve, reject){
	request({
		url: 'http://selcrs.nsysu.edu.tw/menu1/qrycourse.asp?HIS=2&eng=&in_eng=&IDNO=&ITEM=',
		method: 'get',
		encoding: null
	}, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			var res = [[], []];
			body = iconv.decode(body, "Big5");
			var $ = cheerio.load(body);
			var year = $("select[name=D0] > option");
			var className = $("select[name=D1] > option");
			for(var i=1; i<year.length; i++) {
				res[0].push(year[i].children[0].data);
			}
			for(var i=1; i<className.length; i++) {
				res[1].push(className[i].children[0].data);
			}
			resolve(res);
		} else {
			console.log(error);
			reject(error);
		}
	});
});

module.exports = {
	getClassData
};