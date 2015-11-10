var ejs = require("ejs");
var mq_client = require('../rpc/client');
var sha1 = require('sha1');
/* ///////////////////Testing purpose////////////////////////////////////////
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/test";
var db;
mongo.connect(mongoURL, function(err, database) {  
	db=database;    
});
*/
function facebookhome(req,res) {
	if(req.session.email==undefined){
		ejs.renderFile('./views/home.ejs',function(err, result) {
		   if (!err) {
		            res.end(result);
		   }
		   else {
		            res.end('An error occurred');
		            console.log(err);
		   }
	   });
	}
	else{
		console.log("Session name: "+ req.session.email);
		ejs.renderFile('./views/homePage.ejs', function(err, result) {
	        if (!err) {
	        	console.log('Successfully redered homePage');
	            res.end(result);
	        }
	        else {
	            res.end('An error occurred');
	            console.log(err);
	        }
	    });
	}
}

function postStatus(req,res){
	if(req.session.email!=undefined){
		//var tstamp = new Timestamp();
		var msg_payload = { "username": req.session.email, "fname": req.session.fname, 
							"lname": req.session.lname, "news":req.param('postStatus'), "msgid":"postStatus"};

		mq_client.make_request('login_queue',msg_payload, function(err,results){
			console.log(results);
			if(err){
				throw err;
			}
			else 
			{
				if(results.code == 200){
					console.log("Status is updated..");
					homePage(req,res);
				}
				else {    	
					console.log("Status is not updated");
				}
			}  
		});
	}
	else {
		facebookhome(req,res);
	}
}

function signup(req,res) {

	ejs.renderFile('./views/signup.ejs',function(err, result) {
	   if (!err) {
	            res.end(result);
	   }
	   else {
	            res.end('An error occurred');
	            console.log(err);
	   }
   });
}

function afterSignIn(req,res)
{
	var email=req.param("inputUsername");
	var pwd=req.param("inputPassword");
	var msg_payload = { "username": email, "password": sha1(pwd), "msgid":"signin"};
		
	console.log("In POST Request = UserName:"+ email+" "+pwd);
	
	mq_client.make_request('login_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){
				console.log("valid Login");
				//console.log(results.value.result.fname);
				req.session.email = results.value.result.username;
				req.session.fname = results.value.result.fname;
				req.session.lname = results.value.result.lname;
				console.log("Session name: "+ req.session.email);
				homePage(req,res);
				//res.send({"login":"Success"});
			}
			else {    	
				console.log("Invalid Login");
				ejs.renderFile('./views/failLogin.ejs',function(err, result) {
			        // render on success
			        if (!err) {
			            res.end(result);
			        }
			        // render or error
			        else {
			            res.end('An error occurred');
			            console.log(err);
			        }
			    });
			}
		}  
	});
}

function getSession(req,res){

	var json_responses = {};
	var email = req.session.email; 
	var fname = req.session.fname;
	var msg_payload = { "username": email, "msgid": 'news'};

	mq_client.make_request('login_queue',msg_payload, function(err,results){
		
		console.log("Printed result: "+results.value.result[0].news);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){
				console.log("Newsfeeds are fetched into getSession");
				json_responses = {sessionVar : fname,
						   	  newspost : results.value.result };
				res.send(json_responses);
				//res.send({"login":"Success"});
			}
			else {    	
				console.log("Receiving newsfeed error!");
			}
		}  
	});
}

function getProfile(req,res){
	var getNews="select * from profiles where emailid='"+req.session.email+"'";
	var json_responses = {};
	var fname = req.session.fname;
	
	console.log("In getProfile");
	var username = req.session.email;
	
	var msg_payload = { "username": req.session.email, "msgid":'getprofile'};

	mq_client.make_request('login_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){ 
				console.log("fetched data!");
				var json_responses = get_info(results.value.result);
				res.render('profilePage', {profile:json_responses});
				//res.send(json_responses); 
			}
			else 
			{
				res.end('An error occurred');
				console.log(err);	
			}
		}
	});
}

function editProf(req,res){
	ejs.renderFile('./views/editProfile.ejs',function(err, result) {
        if (!err) {
            res.end(result);
        }
        else {
            res.end('An error occurred');
            console.log(err);
        }
    });
}

function afterSignUp(req,res)
{
	// check user already exists
	var email = req.param("emailid");
	var pass = req.param("inpassword");
	var fname = req.param("fname");
	var lname = req.param("lname");
	var msg_payload = { "username": email, "password": sha1(pass), "fname": fname, "lname": lname, "msgid":'signup'};

	mq_client.make_request('login_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){
				console.log("SignUp is Successfull");
				req.session.email = email;
				req.session.fname = fname;
				req.session.lname = lname;
				getHome(req,res);
			}
			else {    	
				console.log("Invalid SignUp");
				ejs.renderFile('./views/failSignUp.ejs',function(err, result) {
			        // render on success
			        if (!err) {
			            res.end(result);
			        }
			        // render or error
			        else {
			            res.end('An error occurred');
			            console.log(err);
			        }
			    });
			}
		}
	}); 
}

function homePage(req,res){
	console.log("In homePage");
	ejs.renderFile('./views/homePage.ejs',function(err, result) {
        if (!err) {
            res.end(result);
        }
        else {
            res.end('An error occurred');
            console.log(err);
        }
    });
}

function get_info(results){
	var fullName = results.fname +" " +results.lname;
	var company,position,city,work_syear,work_eyear,schoolName,sfield,school_syear,school_eyear,tvshow,music,sport,summary;
	if(results.cmpny==null){company=" ";}else{company = results.cmpny;}
	if(results.position==null){position=" ";}else{position = results.position;}
	if(results.city==null){city=" ";}else{city = results.city;}
	if(results.wsy==null){work_syear=" ";}else{work_syear = results.wsy;}
	if(results.wey==null){work_eyear=" ";}else{work_eyear = results.wey;}
	if(results.sname==null){schoolName=" ";}else{schoolName = results.sname;}
	if(results.sfield==null){sfield=" ";}else{sfield = results.sfield;}
	if(results.hsy==null){school_syear=" ";}else{school_syear = results.hsy;}
	if(results.hey==null){school_eyear=" ";}else{school_eyear = results.hey;}
	if(results.tvshow==null){tvshow=" ";}else{tvshow = results.tvshow;}
	if(results.music==null){music=" ";}else{music = results.music;}
	if(results.sport==null){sport=" ";}else{sport = results.sport;}
	if(results.summary==null){summary=" ";}else{summary = results.summary;}
	
	console.log("Profile info is fetched");
	var json_responses = {
		"status":"Success",
		"fname":results.fname,
		"fullName":fullName,
		"company":company,
		"position":position,
		"city":city,
		"work_syear":work_syear,
		"work_eyear":work_eyear,
		"schoolName":schoolName,
		"sfield":sfield,
		"school_syear":school_syear,
		"school_eyear":school_eyear,
		"tvshow":tvshow,
		"music":music,
		"sport":sport,
		"summary":summary
	};
	return json_responses;
}

function getHome(req,res){
	if(req.session.email!=undefined){
		console.log("In getHome");
		var username = req.session.email;
		var msg_payload = { "username": username, "msgid":'getprofile'};

		mq_client.make_request('login_queue',msg_payload, function(err,results){
			
			console.log(results);
			if(err){
				throw err;
			}
			else 
			{
				if(results.code == 200){ 
					console.log("fetched data!");
					var json_responses = get_info(results.value.result);
					res.render('editProfile', {profile:json_responses});
					//res.send(json_responses); 
				}
				else 
				{
					res.end('An error occurred');
					console.log(err);	
				}
			}
		});
	}
	else{
		facebookhome(req,res);
	}
}

function profilePage(req,res) {
	if(req.session.email!=undefined){
		console.log("In profilePage");
		var username = req.session.email;
		
		var msg_payload = { "username": username, "msgid":'getprofile'};

		mq_client.make_request('login_queue',msg_payload, function(err,results){
			
			console.log(results);
			if(err){
				throw err;
			}
			else 
			{
				if(results.code == 200){ 
					console.log("fetched data!");
					var json_responses = get_info(results.value.result);
					res.render('profilePage', {profile:json_responses});
					//res.send(json_responses); 
				}
				else 
				{
					res.end('An error occurred');
					console.log(err);	
				}
			}
		});
	}
	else {
		facebookhome(req,res);
	}
}

function getprofilePage(req,res){
	if(req.session.email!=undefined){
		console.log(req.param('fid'));
		console.log("In getprofilePage");
		var s1 = req.param('fid');
		var FullName = s1.split(" ");
		var fname = FullName[0];
		var lname = FullName[1];
		var query = "select * from profiles where fname='" +fname +"' and lname='"+lname+"'";
		mysql.fetchData(function(err,results1){
			if(results1.length==0){ 
				res.end('An error occurred');
				console.log(err); 
			}
			else 
			{
				console.log("fetched data!");
				var json_responses = get_info(results1);
				res.render('profilePage', {profile:json_responses});
				//res.send(json_responses);
		}},query);
	}
	else{
		facebookhome(req,res);
	}
}

function updateInterests(req,res){
	var msg_payload = { "username": req.session.email, "tvshow": req.param('tvshow'),"music": req.param('music'), 
						"sport": req.param('sport'), "msgid":'updateinterests'};

	mq_client.make_request('login_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){ 
				console.log("Interests are updated");
				getHome(req,res); 
			}
			else 
			{
				res.end('An error occurred');
				console.log(err);	
			}
		}
	});
}

function updatePersonal(req,res){
	var msg_payload = { "username": req.session.email, "cmpny": req.param('cmpny'), "position": req.param('position'), 
						"city": req.param('city'), "wsy": req.param('wsy'), "wey": req.param('wey'), 
						"sname": req.param('sname'), "sfield": req.param('sfield'), "hsy": req.param('hsy'), 
						"hey": req.param('hey'), "msgid":'updatepersonal'};

	mq_client.make_request('login_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){ 
				console.log("Personal info is updated");
				getHome(req,res); 
			}
			else 
			{
				res.end('An error occurred');
				console.log(err);	
			}
		}
	});
}

function updateSummary(req,res){
	var msg_payload = { "username": req.session.email, "summary": req.param('summary'), "msgid":'updatesummary'};

	mq_client.make_request('login_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){ 
				console.log("Summary is updated");
				getHome(req,res); 
			}
			else 
			{
				res.end('An error occurred');
				console.log(err);	
			}
		}
	});
}

function dispSearch(req,res){
	ejs.renderFile('./views/searchResults.ejs',function(err, result) {
        if (!err) {
            res.end(result);
        }
        else {
            res.end('An error occurred');
            console.log("error" +err);
        }
    });
}

function getSearch(req,res){
	var search=req.param("search");
	console.log("Search friend request");
	var msg_payload = { "friendName": search, "userId":req.session.email, "msgid": 'searchFriend'};

	mq_client.make_request('login_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err){
			throw err;
		}
		else {
			if(results.code == 200){ 
				console.log(results.value.result); 
			}
			else {
				console.log("No any friend exists with that name");	
			}
			res.send(results.value.result);
		}
	});
}

function newConn(req,res){

	console.log("New connection request");
	var msg_payload = { "cUserId": req.param("cUserId"), "userId":req.session.email, "msgid": 'newConnection'};
	console.log("Cuserid: "+req.param("cUserId"));
	mq_client.make_request('login_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err){
			throw err;
		}
		else {
			if(results.code == 200){
				res.send({"connect":"Friend"});
			}
			else if(results.code == 201){
				res.send({"connect":"Request already Sent"});
			}
			else if(results.code == 202){
				res.send({"connect":"Request Sent"});
			} 
			else {
				console.log("No any friend exists with that name");
				res.send({"connect":"Error"});	
			}
		}
	});
}

function conns(req,res){
	ejs.renderFile('./views/connections.ejs',function(err, result) {
        // render on success
        if (!err) {
            res.end(result);
        }
        // render or error
        else {
            res.end('An error occurred');
            console.log(err);
        }
    });
}

function groups(req,res){
	ejs.renderFile('./views/groups.ejs',function(err, result) {
        if (!err) {
            res.end(result);
        }
        else {
            res.end('An error occurred');
            console.log(err);
        }
    });
}

function getConns(req,res){
	console.log("New connection request");
	var msg_payload = { "userId":req.session.email, "msgid": 'getConnection'};

	mq_client.make_request('login_queue',msg_payload, function(err,results){
		
		console.log(results.value.result);
		if(err){
			throw err;
		}
		else {
			if(results.code == 200){
				res.send(results.value.result);
			}
			else {
				console.log("There are no any connections");	
			}
		}
	});
}

function accptInv(req,res){

	console.log("Accept invitation request");
	var msg_payload = { "userId":req.session.email, 'iUserId':req.param("iUserId"), "msgid": 'acceptInvitation'};

	mq_client.make_request('login_queue',msg_payload, function(err,results){
		
		console.log(results.value.result);
		if(err){
			throw err;
		}
		else {
			if(results.code == 200){
				//res.send(results.value.result);
				res.send({"status":"Connected"});
			}
			else {
				console.log("Accepting invitation error");	
			}
		}
	});	
}

function showGroups(req,res){
	var msg_payload = { "msgid":'showGroups'};

	mq_client.make_request('login_queue',msg_payload, function(err,results){
		console.log(results.value.result[0].grpName);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){ 
				console.log("Groups are displayed");
				res.send({"status":"Success","groups":results.value.result}); 
			}
			else 
			{
				console.log(err);
				res.send({"status":"Fail","groups":"There is no any group"});
			}
		}
	});
}

function createGrp(req,res){
	var msg_payload = { "grpName": req.param('grpName'), "msgid": 'createGrp'};

	mq_client.make_request('login_queue',msg_payload, function(err,results){
		
		console.log(results.value.result);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){ 
				console.log("New group is created");
				res.send({"status":"Success","groups":results.value}); 
			}
			else 
			{
				res.end('An error occurred');
				console.log(err);
				res.send({"status":"Fail","groups":"There is already a group with the same name."});	
			}
		}
	});
}

function deleteGrp(req,res){
	var grpName = req.param('grpName');
	var msg_payload = { "grpName": grpName, "msgid": 'deleteGrp'};
	console.log("Delete group request");
	mq_client.make_request('login_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){ 
				console.log(grpName + " group is deleted");
				res.send({"status":"Success","groups":"Group is deleted."}); 
			}
			else 
			{
				res.end('An error occurred');
				console.log(err);
				res.send({"status":"Fail","groups":"There is already a group with the same name."});	
			}
		}
	});
}

function addMember(req,res){
	var grpName=req.param('grpName');
	var search = req.param('member');
	var FullName; 
	console.log("Add member request");
	var msg_payload = { "grpName": grpName, "member": search,"msgid": 'addMember'};

	mq_client.make_request('login_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){ 
				console.log(results.value.result);
				res.send({"status":"Success","member":results.value.result}); 
			}
			else 
			{
				console.log("Not found any member with that name");
				res.send({"status":"Fail","member":"Not found"});	
			}
		}
	});
}

function removeMember(req,res){
	var grpName=req.param('grpName');
	var search = req.param('member');
	//var searchArr = search.split(" ");
	//var query,FullName,RemoveId;

	var msg_payload = { "grpName": grpName, "member": search,"msgid": 'addMember'};

	mq_client.make_request('login_queue',msg_payload, function(err,results){
		
		console.log(results.value.result);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){ 
				console.log(results.result);
				res.send({"status":"Success","member":results.value.result}); 
			}
			else 
			{
				console.log("Not found any member with that name");
				res.send({"status":"Fail","member":"Not found"});	
			}
		}
	});
	
}

function getMembers(req,res){
	var grpName=req.param('grpName');
	var msg_payload = { "grpName": grpName,"msgid": 'getMembers'};

	mq_client.make_request('login_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){ 
				console.log(results.value.result);
				res.send({"status":"Success","members":results.value.result}); 
			}
			else 
			{
				console.log("Not found any member within that group");
				res.send({"status":"Fail","members":"Not found"});	
			}
		}
	});
}

function signOut(req,res){
	if(req.session.email==undefined){
		facebookhome(req,res);
	}
	else{
		req.session.destroy();
		console.log("Session is destroyed and successfully logged out.");
		facebookhome(req,res);	
	}
}

function dispGrp(req,res){
	req.session.grpName = req.param('grpName');

	ejs.renderFile('./views/group.ejs',function(err, result) {
        if (!err) {
            res.end(result);
        }
        else {
            res.end('An error occurred');
            console.log(err);
        }
    });
}

function disProfilePage(req,res){
	getprofilePage(req,res);
}

/* ///////////////////Testing purpose////////////////////////////////////////
function testsignin(req,res){
	var email=req.param("inputUsername");
	var pwd=req.param("inputPassword");
	var msg_payload = { "username": email, "password": pwd, "msgid":"signin"};
		
	console.log("In POST Request = UserName:"+ email+" "+pwd);
	
	mq_client.make_request('login_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){
				console.log("valid Login");
				//console.log(results.value.result.fname);
				req.session.email = results.value.result.username;
				req.session.fname = results.value.result.fname;
				req.session.lname = results.value.result.lname;
				console.log("Session name: "+ req.session.email);
				res.render('successSignUp', { username: req.session.email, fname: req.session.fname, lname: req.session.lname });
				//homePage(req,res);
				//res.send({"login":"Success"});
			}
			else {    	
				console.log("Invalid Login");
				ejs.renderFile('./views/failLogin.ejs',function(err, result) {
			        // render on success
			        if (!err) {
			            res.end(result);
			        }
			        // render or error
			        else {
			            res.end('An error occurred');
			            console.log(err);
			        }
			    });
			}
		}  
	});
}

function testsignin(req,res){
	var email=req.param("inputUsername");
	var pwd=req.param("inputPassword");
	var msg_payload = { "username": email, "password": pwd, "msgid":"signin"};
		
	console.log("In POST Request = UserName:"+ email+" "+pwd);
	var coll = mongo.collection('login');

		coll.findOne({username: email, password:sha1(pwd)}, function(err, user){
			if (user) {
				console.log("valid Login");
				//console.log(results.value.result.fname);
				req.session.email = user.username;
				req.session.fname = user.fname;
				req.session.lname = user.lname;
				console.log("Session name: "+ req.session.email);
				res.render('successSignUp', { username: req.session.email, fname: req.session.fname, lname: req.session.lname });
				//homePage(req,res);
				//res.send({"login":"Success"});
			}
			else {    	
				console.log("Invalid Login");
				ejs.renderFile('./views/failLogin.ejs',function(err, result) {
			        // render on success
			        if (!err) {
			            res.end(result);
			        }
			        // render or error
			        else {
			            res.end('An error occurred');
			            console.log(err);
			        }
			    });
			}
		});
}

function testsignup(req,res)
{
	// check user already exists
	var email = req.param("emailid");
	var pass = req.param("inpassword");
	var fname = req.param("fname");
	var lname = req.param("lname");
	var msg_payload = { "username": email, "password": sha1(pass), "fname": fname, "lname": lname, "msgid":'signup'};

// db.login.update({'fname':'Dhruv','lname':'Kakadiya'},{$set:{city:"San Jose"}});
	mq_client.make_request('login_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){
				console.log("SignUp is Successfull");
				req.session.email = email;
				req.session.fname = fname;
				req.session.lname = lname;
				res.render('successSignUp', { username: req.session.email, fname: req.session.fname, lname: req.session.lname });
				//getHome(req,res);
			}
			else {    	
				console.log("Invalid SignUp");
				ejs.renderFile('./views/failSignUp.ejs',function(err, result) {
			        // render on success
			        if (!err) {
			            res.end(result);
			        }
			        // render or error
			        else {
			            res.end('An error occurred');
			            console.log(err);
			        }
			    });
			}
		}
	}); 
}
*/

exports.getHome=getHome;
exports.facebookhome=facebookhome;
exports.signup=signup;
exports.signOut=signOut;
exports.afterSignIn=afterSignIn;
exports.afterSignUp=afterSignUp;
exports.editProf=editProf;
exports.dispSearch=dispSearch;
exports.getSearch=getSearch;
exports.homePage=homePage;
exports.profilePage=profilePage;
exports.updateInterests=updateInterests;
exports.updateSummary=updateSummary;
exports.updatePersonal=updatePersonal;
exports.postStatus=postStatus;
exports.getSession=getSession;
exports.getProfile=getProfile;
exports.newConn=newConn;
exports.getConns=getConns;
exports.accptInv=accptInv;
exports.conns=conns;
exports.showGroups=showGroups;
exports.groups=groups;
exports.createGrp=createGrp;
exports.deleteGrp=deleteGrp;
exports.addMember=addMember;
exports.removeMember=removeMember;
exports.dispGrp=dispGrp;
exports.getMembers=getMembers;
exports.getprofilePage=getprofilePage;
exports.disProfilePage=disProfilePage;
//exports.testsignin = testsignin;
//exports.testsignup = testsignup;