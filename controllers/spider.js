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
			reject(error);
		}
	});
});

var getDeparmentList = new Promise(function(resolve, reject) {
	request({
		url: 'http://selcrs.nsysu.edu.tw/stu_query/crs_mst_qry/crs_mst_query_top.asp',
		method: 'get',
		encoding: null
	}, function(err, response, body) {
		if (!err && response.statusCode == 200) {
			var res = [];
			body = iconv.decode(body, "Big5");
			var $ = cheerio.load(body);
			var DPT1 = $("select[name=DPT1] > option");
			for(var i=2; i<DPT1.length; i++) {
				if (DPT1[i].children[0].data.search('院') == -1) {
					res.push(DPT1[i].children[0].data.slice(6));
				}
			}
			resolve(res);
		} else {
			reject(error);
		}
	});
});

module.exports = {
	getClassData,
	getDeparmentList
};