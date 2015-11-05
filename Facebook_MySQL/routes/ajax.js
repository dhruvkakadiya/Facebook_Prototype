var ejs = require("ejs");
var url = require('url');

var data = {"fname":"stuart","lname":"broad","role":"bowler"};

function demo(req,res) {
	
	ejs.renderFile('./views/ajaxDemo.ejs',{data:data}, function(err,result){
		
		if(!err) {
			res.end(result);
		}
		else {
			res.end('An error occurred');
            console.log(err);
		}
	});
}

function handleGetReq(req,res) {
	
	console.log("In AJAX GET Call");
}

function handlePostReq(req,res) {
	
	console.log("In AJAX Post Call.."+JSON.stringify(req.param("key")));
	var key = req.param("key");
	console.log(data[key]);
	res.end(data[key]);
	
}

exports.demo = demo;
exports.handleGetReq = handleGetReq;
exports.handlePostReq = handlePostReq;