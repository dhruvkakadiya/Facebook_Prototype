var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/test";
var db;
mongo.connect(mongoURL, function(err, database) {  
	db=database;    
});


function handle_signin_request(msg, callback){
	
	var res = {};
	console.log("In handle signin request:"+ msg.username);
	var username = msg.username;
	var password = msg.password;
	
		var coll = mongo.collection('login');

		coll.findOne({username: username, password:password}, function(err, user){
			if (user) {
				// This way subsequent requests will know the user is logged in.
				//req.session.username = user.username;
				console.log(username +" is the session");
				res.code = "200";
				res.value = {"result":user, "error": false, "message": ""};
				callback(null, res);
			} 
			else {
				console.log("Login failed");
				res.code = "401";
				res.value = {"result":"", "error": true, "message": "Failed login"};
				callback(null, res);
			}
		});
}

function handle_signup_request(msg, callback){
	
	var res = {};
	console.log("In handle signup request:"+ msg.username);
	var username = msg.username;
	var password = msg.password;
	var fname = msg.fname;
	var lname = msg.lname;

	
		var coll = mongo.collection('login');

		coll.findOne({username: username}, function(err, user){
			if (user) {
				res.code = "401";
				res.value = {"result":"", "error": true, "message": "Failed Signup as username is already existing."};
				callback(null, res);
			} 
			else {
				coll.insert({'username':username, 'password':password,'fname':fname, 'lname':lname},function(err, user){
					var coll2 = mongo.collection('profiles');
					coll2.insert({'username':username, 'fname':fname, 'lname':lname},function(err2,user2){
						console.log("Successful signup");
						res.code = "200";
						res.value = {"result":"success", "error": false, "message": "Successful signup"};
						callback(null, res);	
					});		
				});
			}
		});
}

function handle_news_request(msg, callback){
	var res = {};
	console.log("In handle news request:");
	var coll = mongo.collection('newsfeed');
	coll.find().sort({'ts':-1}).toArray(function(err,doc){
		if (doc) {
     		console.log(doc);
     		// This way subsequent requests will know the user is logged in.
			//req.session.username = user.username;
			res.code = "200";
			res.value = {"result":doc, "error": false, "message": ""};
			callback(null, res);
  		} 
  		else {
     		console.log("News fetching is failed");
			res.code = "401";
			res.value = {"result":"", "error": true, "message": "Failed login"};
			callback(null, res);
  		}
	});
}

function handle_post_news_request(msg,callback){
	var res = {};
	console.log("In handle post_news request:");
	var coll = mongo.collection('newsfeed');
	coll.insert({'ts':new Date(),'username':msg.username,'fname':msg.fname,'lname':msg.lname,'news':msg.news},function(err,doc){
		if (err) {
     		console.log("Status updating is failed");
			res.code = "401";
			res.value = {"result":"", "error": true, "message": "Failed login"};
			callback(null, res);
  		} 
  		else {
  			console.log(doc);
			res.code = "200";
			res.value = {"result":"Success", "error": false, "message": "Updated new status"};
			callback(null, res);
  		}
	});
}

function handle_get_profile_request(msg,callback){
	var res = {};
	console.log("In handle get_profile request:");
	var coll = mongo.collection('profiles');
	coll.findOne({'username':msg.username},function(err,doc){
		if (doc) {
     		console.log(doc);
			res.code = "200";
			res.value = {"result":doc, "error": false, "message": "Fetched profile data"};
			callback(null, res);
  		} 
  		else {
     		console.log("Fetching profile data error");
			res.code = "401";
			res.value = {"result":"", "error": true, "message": "Failed fetching profile"};
			callback(null, res);
  		}
	});
}

function handle_update_personal_request(msg,callback){
	var res = {};
	console.log("In handle update_personal request:");

	var coll = mongo.collection('profiles');
	coll.update({'username':msg.username},{$set:{cmpny:msg.cmpny, position:msg.position, city:msg.city, wsy:msg.wsy,
		wey:msg.wey, sname:msg.sname, sfield:msg.sfield, hsy:msg.hsy, hey:msg.hey}},function(err,doc){
		if (err) {
     		console.log(err);
			console.log("Updating personal data error");
			res.code = "401";
			res.value = {"result":"", "error": true, "message": "Failed to update personal data"};
			callback(null, res);
  		} 
  		else {
     		res.code = "200";
			res.value = {"result":"Success", "error": false, "message": "Updated personal data"};
			console.log("updated personal data");
			callback(null, res);
  		}
	});	
}

function handle_update_interests_request(msg,callback){
	var res = {};
	console.log("In handle update_interests request:");

	var coll = mongo.collection('profiles');
	coll.update({'username':msg.username},{$set:{tvshow:msg.tvshow, music:msg.music, sport:msg.sport}},function(err,doc){
		if (err) {
     		console.log(err);
			console.log("Updating interests data error");
			res.code = "401";
			res.value = {"result":"", "error": true, "message": "Failed to update interests data"};
			callback(null, res);
  		} 
  		else {
     		res.code = "200";
			res.value = {"result":"Success", "error": false, "message": "Updated interests data"};
			console.log("updated interests data");
			callback(null, res);
  		}
	});	
}

function handle_update_summary_request(msg,callback){
	var res = {};
	console.log("In handle update_interests request:");
	var coll = mongo.collection('profiles');
	coll.update({'username':msg.username},{$set:{summary:msg.summary}},function(err,doc){
		if (err) {
     		console.log(err);
			console.log("Updating summary data error");
			res.code = "401";
			res.value = {"result":"", "error": true, "message": "Failed to update interests data"};
			callback(null, res);
  		} 
  		else {
     		res.code = "200";
			res.value = {"result":"Success", "error": false, "message": "Updated interests data"};
			console.log("updated summary data");
			callback(null, res);
  		}
	});
}

function handle_show_groups_request(msg,callback){
	var res = {};
	console.log("In handle show_groups request:");

	var coll = mongo.collection('groups');
	coll.find().toArray(function(err,doc) {
		if (err) {
     		console.log(err);
			console.log("showing groups error");
			res.code = "401";
			res.value = {"result":"", "error": true, "message": "Failed to show groups"};
			callback(null, res);
  		} 
  		else {
     		res.code = "200";
			res.value = {"result":doc, "error": false, "message": "Displaying all groups"};
			console.log(doc);
			callback(null, res);
  		}
	});	
}

function handle_create_group_request(msg,callback){
	var res = {};
	console.log("In handle create_group request:");


	var coll = mongo.collection('groups');
	coll.insert({'grpName':msg.grpName},function(err,doc){
		if (err) {
     		console.log(err);
			console.log("Creating group "+msg.grpName+" error");
			res.code = "401";
			res.value = {"result":"", "error": true, "message": "Failed to create new group"};
			callback(null, res);
  		} 
  		else {
     		res.code = "200";
			res.value = {"result":msg.grpName, "error": false, "message": "Created new group"};
			console.log(msg.grpName+" group is created");
			callback(null, res);
  		}
	});

}

function handle_delete_group_request(msg,callback){
	var res = {};
	console.log("In handle delete_group request:");

	var coll = mongo.collection('groups');
	coll.findOne({'grpName':msg.grpName},function(err,doc){
		if(doc){	
			
			coll.remove({'grpName':msg.grpName},function(err1,doc1){
				//console.log(doc);
				if (doc1) {
					res.code = "200";
					res.value = {"result":msg.grpName, "error": false, "message": "Deleted group"};
					console.log(msg.grpName+" group is deleted");
					callback(null, res);
	      		} 
	      		else {
	         		console.log(err1);
					console.log("Deleting group "+msg.grpName+" but not available");
					res.code = "401";
					res.value = {"result":"", "error": true, "message": "No group exist with that name"};
					callback(null, res);
	      		}
			});
		}
		else{
			//console.log(err);
			console.log("Deleting group "+msg.grpName+" but not available");
			res.code = "401";
			res.value = {"result":"", "error": true, "message": "No group exist with that name"};
			callback(null, res);
		}
	});
}

function handle_get_members_request(msg,callback){
	var res = {};
	console.log("In handle get_members request:");

	
	var coll = mongo.collection('groups');
	coll.findOne({'grpName':msg.grpName},function(err,doc){
		if (doc) {
			res.code = "200";
			res.value = {"result":doc, "error": false, "message": "Deleted group"};
			console.log(doc);
			callback(null, res);
  		} 
  		else {
     		console.log(err);
			console.log("No members are available");
			res.code = "401";
			res.value = {"result":"", "error": true, "message": "No members are there within this group"};
			callback(null, res);
  		}
	});
}

function handle_add_member_request(msg,callback){
	var res = {};
	console.log("In handle add_member request:");
	console.log(msg.grpName + msg.member);
	var search = msg.member;
	var searchArr = search.split(" ");
	if(searchArr.length>1){
		
			var coll = mongo.collection('login');
		 	coll.findOne({$or:[{fname:search},{lname:search},{fname:searchArr[0]},{lname:searchArr[1]},{fname:searchArr[1]},
		 		{lname:searchArr[0]}]},function(err,user){
		 		if(user){
					var memberName = user.fname + " " + user.lname;
					
						var coll1 = mongo.collection('groups');
					 	coll1.update({"grpName":msg.grpName},{$push:{'members':memberName}},{upsert:true},function(err,doc){
					 		if(user){
					 			res.code = "200";
								res.value = {"result":memberName, "error": false, "message": "Added member into group"};
								console.log(memberName+" is added in the group");
								callback(null, res);
					 		}
					 		else{
					 			console.log(err);
								console.log("Adding member "+memberName+" error");
								res.code = "401";
								res.value = {"result":"", "error": true, "message": "Failed to add new member"};
								callback(null, res);
					 		}
					 	});
		 		}
		 		else{
		 			console.log(err);
					console.log("Adding member "+msg.member+" error");
					res.code = "401";
					res.value = {"result":"", "error": true, "message": "Failed to add new member"};
					callback(null, res);
		 		}
		 	});
	}
	else{
		
			var coll = mongo.collection('login');
		 	coll.findOne({$or:[{fname:search},{lname:search},{username:search}]},function(err,user){
		 		if(user){
		 			var memberName = user.fname + " " + user.lname;
					
						var coll1 = mongo.collection('groups');
					 	coll1.update({"grpName":msg.grpName},{$push:{'members':memberName}},{upsert:true},function(err,doc){
					 		if(user){
					 			res.code = "200";
								res.value = {"result":memberName, "error": false, "message": "Added member into group"};
								console.log(memberName+" is added in the group");
								callback(null, res);
					 		}
					 		else{
					 			console.log(err);
								console.log("Adding member "+memberName+" error");
								res.code = "401";
								res.value = {"result":"", "error": true, "message": "Failed to add new member"};
								callback(null, res);
					 		}
					 	});
		 		}
		 		else{
		 			console.log(err);
					console.log("Adding member "+msg.member+" error");
					res.code = "401";
					res.value = {"result":"", "error": true, "message": "Failed to add new member"};
					callback(null, res);
		 		}
		 	});
	}
}

function handle_remove_member_request(msg,callback){
	var res = {};
	console.log("In handle remove_member request:");
	var search = msg.memberName;
	var searchArr = search.split(" ");
	if(searchArr.length>1){
			var coll = mongo.collection('login');
		 	coll.findOne({$or:[{fname:search},{lname:search},{fname:searchArr[0]},{lname:searchArr[1]},{fname:searchArr[1]},
		 		{lname:searchArr[0]}]},function(err,user){
		 		if(user){
					var memberName = user.fname + " " + user.lname;
					
						var coll1 = mongo.collection('groups');
					 	coll1.update({"grpName":msg.grpName},{$pull:{'members':memberName}},function(err,doc){
					 		if(user){
					 			res.code = "200";
								res.value = {"result":memberName, "error": false, "message": "Removed member from the group"};
								console.log(memberName+" is removed from the group");
								callback(null, res);
					 		}
					 		else{
					 			console.log(err);
								console.log("Removing member "+memberName+" error");
								res.code = "401";
								res.value = {"result":"", "error": true, "message": "Failed to rmeove that member"};
								callback(null, res);
					 		}
					 	});
		 		}
		 		else{
		 			console.log(err);
					console.log("Removing member "+msg.member+" error");
					res.code = "401";
					res.value = {"result":"", "error": true, "message": "Failed to remove that member"};
					callback(null, res);
		 		}
		 	});
	}
	else{
		
			var coll = mongo.collection('login');
		 	coll.findOne({$or:[{fname:search},{lname:search},{username:search}]},function(err,user){
		 		if(user){
		 			var memberName = user.fname + " " + user.lname;
					
						var coll1 = mongo.collection('groups');
					 	coll1.update({"grpName":msg.grpName},{$pull:{'members':memberName}},function(err,doc){
					 		if(user){
					 			res.code = "200";
								res.value = {"result":memberName, "error": false, "message": "Removed member from the group"};
								console.log(memberName+" is removed from the group");
								callback(null, res);
					 		}
					 		else{
					 			console.log(err);
								console.log("Removing member "+memberName+" error");
								res.code = "401";
								res.value = {"result":"", "error": true, "message": "Failed to remove the member"};
								callback(null, res);
					 		}
					 	});
				
		 		}
		 		else{
		 			console.log(err);
					console.log("Removing member "+msg.member+" error");
					res.code = "401";
					res.value = {"result":"", "error": true, "message": "Failed to remove the member"};
					callback(null, res);
		 		}
		 	});
	}	
}

function handle_search_friend_request(msg,callback){
	var res = {};
	var userId = msg.userId;
	var cFullName, cBool, cUserId, errMsg;
	var trial = [];
	console.log("In handle search_friend request:");
	var search = msg.friendName;
	var searchArr = search.split(" ");
	if(searchArr.length>1){
		
			var coll = mongo.collection('login');
		 	coll.find({$or:[{fname:search},{lname:search},{fname:searchArr[0]},{lname:searchArr[1]},{fname:searchArr[1]},
		 	{lname:searchArr[0]}]}).toArray(function(err,user){
		 		cUserId = user[0].username;
	 			if(user){
	 				console.log(user);
	 				
		 				var coll1 = mongo.collection("connections");
		 				coll1.find({$or:[{'uid1':userId, 'uid2':cUserId},{'uid2':userId, 'uid1':cUserId}]}).toArray(function(err1,user1){
		 					console.log(user1);
		 					if(user1.length === 1 || userId.toString() === cUserId.toString()){
		 						cbool = true;
		 					}
		 					else{
		 						cbool = false;
		 					}
		 					var json_responses = {
								"search":"Success",
								"fullName":cFullName,
								"cUserId":cUserId,
								"cBool":cBool,
								"All data":trial
							};
							res.code = "200";
							res.value = {"result":json_responses, "error": false, "message": "Find friend"};
							//console.log(memberName+" is removed from the group");
							callback(null, res);
		 				});
		 			
	 			}
	 			else{
	 				console.log("No Search Results");
					var json_responses = {
						"search":"Error",
						"errMsg":"Not a single entry found in database with entered name. Try with different name."
					};
					console.log(err);
					res.code = "401";
					res.value = {"result":json_responses, "error": true, "message": "Failed to remove the member"};
					callback(null, res);
	 			}
		 	});
	}
	else{
		
			var coll = mongo.collection('login');
		 	coll.find({$or:[{fname:search},{lname:search},{username:search}]}).toArray(function(err,user){
		 		cUserId = user[0].username;
		 		cFullName = user[0].fname + " " + user[0].lname;
	 			if(user){
	 				console.log(user);
	 				
		 				var coll1 = mongo.collection("connections");
		 				coll1.find({$or:[{'uid1':userId, 'uid2':cUserId},{'uid2':userId, 'uid1':cUserId}]}).toArray(function(err1,user1){
		 					console.log(user1);
		 					if(user1.length === 1 || userId.toString() === cUserId.toString()){
		 						cbool = true;
		 					}
		 					else{
		 						cbool = false;
		 					}
		 					var json_responses = {
								"search":"Success",
								"fullName":cFullName,
								"cUserId":cUserId,
								"cBool":cBool,
								"All data":trial
							};
							res.code = "200";
							res.value = {"result":json_responses, "error": false, "message": "Find friend"};
							//console.log(memberName+" is removed from the group");
							callback(null, res);
		 				});
	 			}
	 			else{
	 				console.log("No Search Results");
					var json_responses = {
						"search":"Error",
						"errMsg":"Not a single entry found in database with entered name. Try with different name."
					};
					console.log(err);
					res.code = "401";
					res.value = {"result":json_responses, "error": true, "message": "Failed to remove the member"};
					callback(null, res);
	 			}
		 	});
	}
}

function handle_new_connection_request(msg,callback){
	var res = {};
	console.log("In handle new_connection request:");
	
		var coll = mongo.collection('connections');
	 	coll.findOne({uid1:msg.userId,uid2:msg.cUserId},function(err,user){
	 		if(user){
		 		if(user.status=='1'){
		 			//console.log(err);
					res.code = "200";
					res.value = {"result":"Success", "error": false, "message": "Friend"};
					callback(null, res);
		 		}
		 		else if(user.status=='0'){
		 			res.code = "201";
					res.value = {"result":"Success", "error": false, "message": "Request sent already"};
					callback(null, res);
		 		}
		 	}
	 		else{
	 			console.log("Try to send friend request");
				
					var coll1 = mongo.collection('connections');
		 			coll1.insert({uid2:msg.userId,uid1:msg.cUserId,'status':'0'},function(err1,user1){
		 				if(err1){
		 					throw err;
		 				}
		 				else{
		 					console.log("Request sent Successfully");
		 					res.code = "202";
							res.value = {"result":"Success", "error": false, "message": "Request sent"};
							callback(null, res);
		 				}
		 			});	
	 		}
	 	});
}

function handle_get_connection_request(msg,callback){
	var res = {};
	var uid2 = [];
	var uid3 = [];
	var iFullName, iCount,cCount, iUserId, cFullNames = "";
	console.log("In handle get_connection request:");
	
		var coll = mongo.collection('connections');
	 	coll.find({uid1:msg.userId,'status':'0'},{uid1:0}).toArray(function(err,user){
	 		if(err) {
	 			throw err;
	 		}
	 		else{
	 			console.log(user);
	 			if(user){
			 		for(var i=0;i<user.length;i++){
			 			uid2.push(user[i].uid2);
			 		}
			 		console.log("uid2: "+uid2);
			 		
						var coll1 = mongo.collection('login');
					 	coll1.find({username:{$in:uid2}}).toArray(function(err1,user1){
					 		if(err1){
					 			throw err1;
					 		}
					 		else{
					 			console.log(user1);
					 			if(user1){
							 		iCount = user1.length;
									if (user1.length > 0) {
										iFullName = user1[0].fname +" " +user1[0].lname;
										iUserId = user1[0].username;
									}
									console.log(iFullName);
									console.log(iUserId);
								}
								else{
									iCount = 0;
									iFullName = "";
									iUserId = "";
								}
							}
						});
			 	}
		 		
				
					var coll2 = mongo.collection('connections');
		 			coll2.find({uid1:msg.userId,'status':'1'},{uid1:0}).toArray(function(err2,user2){
		 				if(err2){
		 					throw err2;
		 				}
		 				else{
		 					console.log(user2);
		 					if(user2){
			 					for(var i=0;i<user2.length;i++){
						 			uid3.push(user2[i].uid2);
						 		}
								
									var coll3 = mongo.collection('login');
				 					coll3.find({username:{$in:uid3}}).toArray(function(err3,user3){
				 						if(err3){
				 							throw err3;
				 						}
				 						else{
				 							console.log(user3);
				 							for (var i=0; i<user3.length;i++) {
												cFullNames += user3[i].fname +" " +user3[i].lname;
												if (i !== user3.length -1) {
													cFullNames += "@#$&*";
												}
											}
											console.log(cFullNames);
											cCount = user3.length;										
				 						}
				 						console.log("Successfully sending json_responses");
										var json_responses = {"status":"Success","iFullName":iFullName,"iUserId":iUserId,"iCount":iCount,"cCount":cCount,"cFullNames":cFullNames};
										res.code = "200";
										res.value = {"result":json_responses, "error": false, "message": "Got connections"};
										callback(null, res);
				 					});
				 				
							}
							else{
								cCount  = 0;
								cFullNames = "";
							}
							
						}
				 	});
			}
	 	});
}

function handle_accept_invitation_request(msg,callback){
	var res = {};
	console.log("In handle accept_invitation request:");
	
		var coll = mongo.collection('connections');
	 	coll.insert({'uid1':msg.iUserId,'uid2':msg.userId,'status':'1'},function(err,user){
			if(err){
				throw err;
			}
			else{
				
					var coll1 = mongo.collection('connections');
		 			coll1.update({'uid2':msg.iUserId,'uid1':msg.userId},{'uid2':msg.iUserId,'uid1':msg.userId,'status':'1'},function(err,user){
		 				if(err){
		 					throw err;
		 				}
		 				else{
		 					res.code = "200";
							res.value = {"result":"Success", "error": false, "message": "Accepted invitation"};
							callback(null, res);	
		 				}		
		 			});
			}
		});
}

// db.login.update({'fname':'Dhruv','lname':'Kakadiya'},{$set:{city:"San Jose"}});
// db.trial.update({"grpName":"computer"},{$push:{members:["dhruv"]}},{upsert:true});
// db.trial.update({"grpName":"computer"},{$pull:{members:["vishal"]}});
//db.posts.find({post_text:{$regex:"tutorialspoint",$options:"$i"}})
exports.handle_signin_request = handle_signin_request;
exports.handle_news_request = handle_news_request;
exports.handle_post_news_request = handle_post_news_request;
exports.handle_signup_request = handle_signup_request;
exports.handle_get_profile_request = handle_get_profile_request;
exports.handle_update_personal_request = handle_update_personal_request;
exports.handle_update_interests_request = handle_update_interests_request;
exports.handle_update_summary_request = handle_update_summary_request;
exports.handle_show_groups_request = handle_show_groups_request;
exports.handle_create_group_request = handle_create_group_request;
exports.handle_delete_group_request = handle_delete_group_request;
exports.handle_get_members_request = handle_get_members_request;
exports.handle_add_member_request = handle_add_member_request;
exports.handle_remove_member_request = handle_remove_member_request;
exports.handle_search_friend_request = handle_search_friend_request;
exports.handle_new_connection_request = handle_new_connection_request;
exports.handle_get_connection_request = handle_get_connection_request;
exports.handle_accept_invitation_request = handle_accept_invitation_request;