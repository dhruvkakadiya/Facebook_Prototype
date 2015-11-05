var ejs = require("ejs");
var mysql = require('./mysql');
var passHash = require('password-hash');

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
	        	console.log('Successfully redered homePage')
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
		var updateStatus="insert into newsfeed (emailid,fname,lname,news) values ('" + req.session.email + "','" + req.session.fname + "','" + req.session.lname + "','" + req.param('postStatus') + "')";

		mysql.writeData(function(err,results){
			if(err){
				throw err;
			}
			else 
			{
				console.log("Status is updated..");
				homePage(req,res);
			}
		},updateStatus);
	}
	else{
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
	var getUser="select * from users where emailid='"+email+"'";
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length>0){
				if(results[0]['password']===pwd){
					console.log("valid Login");
					req.session.email = email;
					req.session.fname = results[0]['fname'];
					req.session.lname = results[0]['lname'];
					console.log("Session name: "+ req.session.email);
					homePage(req,res);
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
			else {    
				console.log("Invalid Login");
				ejs.renderFile('./views/failLogin.ejs',function(err, result) {
			        if (!err) {
			            res.end(result);
			        }
			        else {
			            res.end('An error occurred');
			            console.log(err);
			        }
			    });
			}
		}  
	},getUser);
}

function getSession(req,res){
	var getNews="select * from newsfeed order by postid desc";
	var json_responses = {};
	var fname = req.session.fname;
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			console.log("Newsfeeds are sending to getSession");
			json_responses = {sessionVar : fname,
						   	  newspost : results };
			res.send(json_responses);
		}  
	},getNews);
	
}

function getProfile(req,res){
	var getNews="select * from profiles where emailid='"+req.session.email+"'";
	var json_responses = {};
	var fname = req.session.fname;
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			console.log("Profile data is sending to getProfile");
			json_responses = {sessionVar : fname,
						   	  profiles : results };
			res.send(json_responses);
		}  
	},getNews);
	
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
	var checkUser = "select * from users where emailid='"+email+"'";
	var f = 1;

	mysql.fetchData(function(err,results){
		if(err) {
			throw err;
		}
		else {
			if(results.length>0)
				f=0;
		}

		if(f==1) {
			var getUser="insert into users values('"+email+"','" + pass +"','" + fname + "','" + lname + "')";
			
			mysql.writeData(function(err,results){
				if(err){
					throw err;
				}
				else 
				{
					var insertProfile="insert into profiles (emailid,fname,lname) values ('" + email + "','" + fname + "','" + lname + "')";

					mysql.writeData(function(err,results){
						if(err){
							throw err;
						}
						else 
						{
							console.log("valid SignUp");
							req.session.email = email;
							req.session.fname = fname;
							req.session.lname = lname;
							getHome(req,res);
						}
					},insertProfile);
				}  
			},getUser);
		}
		else {
			console.log("SignUp is failed");
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
	},checkUser);
}

function homePage(req,res){
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

function get_info(results1){
	var fullName = results1[0].fname +" " +results1[0].lname;
	var company,position,city,work_syear,work_eyear,schoolName,sfield,school_syear,school_eyear,tvshow,music,sport,summary;
	if(results1[0].cmpny==null){company=" ";}else{company = results1[0].cmpny;}
	if(results1[0].position==null){position=" ";}else{position = results1[0].position;}
	if(results1[0].city==null){city=" ";}else{city = results1[0].city;}
	if(results1[0].wsy==null){work_syear=" ";}else{work_syear = results1[0].wsy;}
	if(results1[0].wey==null){work_eyear=" ";}else{work_eyear = results1[0].wey;}
	if(results1[0].sname==null){schoolName=" ";}else{schoolName = results1[0].sname;}
	if(results1[0].sfield==null){sfield=" ";}else{sfield = results1[0].sfield;}
	if(results1[0].hsy==null){school_syear=" ";}else{school_syear = results1[0].hsy;}
	if(results1[0].hey==null){school_eyear=" ";}else{school_eyear = results1[0].hey;}
	if(results1[0].tvshow==null){tvshow=" ";}else{tvshow = results1[0].tvshow;}
	if(results1[0].music==null){music=" ";}else{music = results1[0].music;}
	if(results1[0].sport==null){sport=" ";}else{sport = results1[0].sport;}
	if(results1[0].summary==null){summary=" ";}else{summary = results1[0].summary;}
	
	console.log("Profile info is fetched");
	var json_responses = {
		"status":"Success",
		"fname":results1[0].fname,
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
		var userId = req.session.email;
		var query;
		
		query = "select * from profiles where emailid= '" +userId +"'";
		mysql.fetchData(function(err,results1){
			if(results1.length==0){ 
				res.end('An error occurred');
				console.log(err); 
			}
			else 
			{
				console.log("fetched data!");
				var json_responses = get_info(results1);
				res.render('editProfile', {profile:json_responses});
				//res.send(json_responses);
		}},query);
	}
	else{
		facebookhome(req,res);
	}
}

function profilePage(req,res){
	if(req.session.email!=undefined){
		console.log("In profilePage");
		var userId = req.session.email;
		var query;
		
		query = "select * from profiles where emailid= '" +userId +"'";
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
	var insertProfile="update profiles set tvshow='" + req.param('tvshow') + "', music='" + req.param('music') + "', sport='" + req.param('sport') + "' where emailid='"+req.session.email+"'";

	mysql.writeData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			console.log("Interests are updated");
			getHome(req,res);
		}
	},insertProfile);
}

function updatePersonal(req,res){
	var insertProfile="update profiles set cmpny='" + req.param('cmpny') + "', position='" + req.param('position') 
		+ "', city='" + req.param('city') + "', wsy='" + req.param('wsy') + "', wey='" + req.param('wey') + "', sname='" 
		+ req.param('sname') + "', sfield='" + req.param('sfield') + "', hsy='" + req.param('hsy') + "', hey='" 
		+ req.param('hey') + "' where emailid='"+req.session.email+"'";

	mysql.writeData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			console.log("Personal info is updated");
			getHome(req,res);
		}
	},insertProfile);
}

function updateSummary(req,res){
	var insertProfile="update profiles set summary='" + req.param('summary') +"' where emailid='"+req.session.email+"'";

	mysql.writeData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			console.log("Summary is updated");
			getHome(req,res);
		}
	},insertProfile);
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
	//var userId = req.param("userId");
	var userId = req.session.email;
	var query;
	//session.searchVal = search;
	var searchArr = search.split(" ");
	var cFullName, cBool, cUserId, errMsg;
	var trial = [];
	if (searchArr.length>1) {
		query = "select * from users where (fname = '" +search +"') or (lname = '" +search +"') or (fname = '" +searchArr[0] +"' or lname = '" +searchArr[1] +"') or (fname = '" +searchArr[1] +"' or lname = '" +searchArr[0] +"')";
	}
	else {
		query = "select * from users where (fname = '" +search +"') or (lname = '" +search +"') or (emailid = '" +search +"')";
	}
	if (query!==undefined) {
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				console.log(results[0].emailid);
				cFullName = results[0].fname +" " +results[0].lname;
				cUserId = results[0].emailid;
				for(var i=0;i<results.length;i++){
					trial.push(results[i].emailid);	
				}
				
				query = "select *from connections where (uid1 = '" +userId +"' and uid2 = '" +cUserId +"') or (uid1 = '" +cUserId +"' and uid2 = '" +userId +"')";
				mysql.fetchData(function(err,results){
					if(err) { throw err; }
					else {
						console.log("u:"+userId +",cu:" +cUserId);
						if(results.length === 1 || userId.toString() === cUserId.toString()){
							cBool = true;
						}
						else {
							cBool = false;
						}
						var json_responses ={
							"search":"Success",
							"fullName":cFullName,
							"cUserId":cUserId,
							"cBool":cBool,
							"All data":trial
						}; 
						res.send(json_responses);
					}
				},query);
			}
			else {    
				console.log("No Search Results");
				var json_responses = {
					"search":"Error",
					"errMsg":"Not a single entry found in database with entered name. Try with different name."
				};
				res.send(json_responses);
			}
		}
	},query);
	}
	else {
		var json_responses = {
			"search":"Error",
			"errMsg":"Please enter a valid name or email"
		}; 
		res.send(json_responses);
	}
}

function newConn(req,res){
	var cUserId=req.param("cUserId");
	var userId=req.session.email;
	var newquery = "select * from connections where uid1='"+userId+"' and uid2='"+cUserId+"'";
	mysql.fetchData(function(err,results) {
		if(err){
			throw err;
		}
		else {
			if(results.length>0){
				if(results[0].status=='0'){
					res.send({"connect":"Request Sent already"});		
				}
				else{
					res.send({"connect":"Friend"});	
				}
			}
			else{
				var query="insert into connections (status, uid1, uid2) values ('0','"+cUserId +"','"+userId+"')";
				mysql.fetchData(function(err,results1) {
					if(err){
						throw err;
					}
					else {
						res.send({"connect":"Request Sent"});
					}  
				},query);
			}
		}  
	},newquery);
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
	var userId = req.session.email;
	var query;
	var iFullName, iCount, iUserId, cFullNames = "";
	query = "select * from users where emailid in (select uid2 from connections where uid1 = '" +userId +"' and status = '0')";

	mysql.fetchData(function(err,results){
		if(err){ throw err; }
		else 
		{
			iCount = results.length;
			if (results.length > 0) {
				iFullName = results[0].fname +" " +results[0].lname;
				iUserId = results[0].emailid;
			}
			query = "select * from users where emailid in (select uid2 from connections where uid1 = '" +userId +"' and status = '1')";
			
			mysql.fetchData(function(err,results){
				if(err) { throw err; }
				else {
					for (var i=0; i<results.length;i++) {
						cFullNames += results[i].fname +" " +results[i].lname;
						if (i !== results.length -1) {
							cFullNames += "@#$&*";
						}
					}
					res.send({"status":"Success","iFullName":iFullName,"iUserId":iUserId,"iCount":iCount,"cCount":results.length,"cFullNames":cFullNames});
				}
				},query);
		}
	},query);
}

function accptInv(req,res){
	var iUserId=req.param("iUserId");
	var userId=req.session.email;
	var query="insert into connections (status, uid1, uid2) values ('1','"+iUserId +"','"+userId+"')";
	mysql.fetchData(function(err,results) {
		if(err){
			throw err;
		}
		else {
			var query="update connections set status = '1' where uid1 = '" +userId +"' and uid2 = '" +iUserId +"'";
			mysql.fetchData(function(err,results) {
				if(err){
					throw err;
				}
				else {
					res.send({"status":"Connected"});
				}  
			},query);
		}
	},query);
}

function showGroups(req,res){
	var userId = req.session.email;
	var query = "select * from groups";

	mysql.fetchData(function(err,results) {
		if(err){
			throw err;
		}
		else {
			if(results.length>0){
				res.send({"status":"Success","groups":results});
			}
			else{
				res.send({"status":"Fail","groups":"There is no any group"});	
			}
		}
	},query);
}

function createGrp(req,res){
	var userId = req.session.email;
	var grpName = req.param('grpName');
	var query = "select * from groups where gname='"+grpName+"'";
	mysql.fetchData(function(err,results) {
		if(err){
			throw err;
		}
		else {
			if(results.length>0){
				res.send({"status":"Fail","groups":"There is already a group with the same name."});
			}
			else{
				var query1 = "insert into groups (gname) values ('"+grpName+"')";
				mysql.fetchData(function(err,results) {
					if(err){
						throw err;
					}
					else {
						var query2 = "select * from groups";
						mysql.fetchData(function(err,results) {
							if(err){
								throw err;
							}
							else {
								res.send({"status":"Success","groups":results});
							}  
						},query2);
					}  
				},query1);	
			}
		}
	},query);
}

function deleteGrp(req,res){
	var grpName = req.param('grpName');
	var query = "select * from groups where gname='"+grpName+"'";
	mysql.fetchData(function(err,results) {
		if(err){
			throw err;
		}
		else {
			if(results.length>0){
				var gid = results[0].gid;
				var newquery = "delete from members where gid='"+gid+"'";
				var query = "delete from groups where gname='"+grpName+"'";
				mysql.fetchData(function(err,results) {
					if(err){
						throw err;
					}
					else {
						mysql.fetchData(function(err,results) {
							if(err){
								throw err;
							}
							else{
								res.send({"status":"Success","groups":"Group is deleted."});		
							}
						},newquery);
					}  
				},query);	
			}
			else{
				res.send({"status":"Fail","groups":"There is no any group with that name."});
			}
		}
	},query);
}

function addMember(req,res){
	var gid=parseInt(req.param('grpName'));
	var search = req.param('member');
	var searchArr = search.split(" ");
	var query,FullName,AddId;

	if (searchArr.length>1) {
		query = "select * from users where (fname = '" +search +"') or (lname = '" +search +"') or (fname = '" +searchArr[0] +"' or lname = '" +searchArr[1] +"') or (fname = '" +searchArr[1] +"' or lname = '" +searchArr[0] +"')";
	}
	else {
		query = "select * from users where (fname = '" +search +"') or (lname = '" +search +"') or (emailid = '" +search +"')";
	}

	if (query!==undefined) {
		mysql.fetchData(function(err,results){
			if(err){
				throw err;
			}
			else 
			{
				if(results.length > 0){
					console.log(results[0].emailid);
					FullName = results[0].fname +" " +results[0].lname;
					AddId = results[0].emailid;
					var query1 = "insert into members (gid,memberid,fullname) values ("+gid+",'"+AddId+"','"+FullName+"')";
					mysql.fetchData(function(err,results){
						if(err){
							throw err;
						}
						else 
						{
							console.log(gid,FullName);
							res.send({"status":"Success","member":FullName});						
						}		
					},query1);
				}
				else{
					console.log("Not found any member with that name");
					res.send({"status":"Fail","member":"Not found"});
				}
			}
		},query);
	}
}

function removeMember(req,res){
	var gid=parseInt(req.param('grpName'));
	var search = req.param('member');
	var searchArr = search.split(" ");
	var query,FullName,RemoveId;

	if (searchArr.length>1) {
		query = "select * from users where (fname = '" +search +"') or (lname = '" +search +"') or (fname = '" +searchArr[0] +"' or lname = '" +searchArr[1] +"') or (fname = '" +searchArr[1] +"' or lname = '" +searchArr[0] +"')";
	}
	else {
		query = "select * from users where (fname = '" +search +"') or (lname = '" +search +"') or (emailid = '" +search +"')";
	}

	if (query!==undefined) {
		mysql.fetchData(function(err,results){
			if(err){
				throw err;
			}
			else 
			{
				if(results.length > 0){
					console.log(results[0].emailid);
					FullName = results[0].fname +" " +results[0].lname;
					RemoveId = results[0].emailid;
					var query1 = "delete from members where gid="+gid+" and memberid='"+RemoveId+"'";
					mysql.fetchData(function(err,results){
						if(err){
							throw err;
						}
						else 
						{
							console.log(gid,FullName);
							res.send({"status":"Success","member":FullName});						
						}		
					},query1);
				}
				else{
					console.log("Not found any member with that name");
					res.send({"status":"Fail","member":"Not found"});
				}
			}
		},query);
	}
}

function getMembers(req,res){
	var gid=req.param('gid');
	var query="select * from members where gid="+gid;
	mysql.fetchData(function(err,results) {
		if(err){
			throw err;
		}
		else{
			res.send({"status":"Success","members":results});		
		}
	},query);
}

function signOut(req,res){
	if(req.session.email==undefined){
		facebookhome(req,res);
	}
	else{
		delete req.session.reset();
		console.log("Session is destroyed and successfully logged out.");
		facebookhome(req,res);	
	}
}

function dispGrp(req,res){
	req.session.gid = req.param('gid');

	ejs.renderFile('./views/group.ejs',function(err, result) {
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

function disProfilePage(req,res){
	getprofilePage(req,res);
}

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
/*
<!--
		<ul>
			<% for(var i=0; i < news.length; i++) { %>
			<li class="list-group-item list-group-item-info"><b><%= news[i].fname %><b></li>
   			<li class="list-group-item list-group-item-info"><%= news[i].news %></li>
   			<br>
			<% } %>
		</ul>
		-->



		<input type="text" class="form-control" ng-model="member[$index]" placeholder="Member name" style="width:300px;top:8px" ngRequired><br>
  				<button type="submit" href="#" class="btn btn-primary navbar-btn" ng-click="addMember(x.gid,$index)">
				<span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button>
  				<button type="submit" class="btn btn-danger navbar-btn" ng-click="deleteMember(x.gid)">
				<span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button>
/afterSignIn?inputUsername=dhruv.kakadiya@gmail.com&inputPassword=donotopen
		*/