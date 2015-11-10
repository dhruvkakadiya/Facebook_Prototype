//super simple rpc server example
var amqp = require('amqp')
, util = require('util');

var login = require('./services/login')

var cnn = amqp.createConnection({host:'127.0.0.1'});

cnn.on('ready', function(){
	
	console.log("listening on login_queue");

	cnn.queue('login_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			switch(message.msgid) {
				case "signin":
					login.handle_signin_request(message, function(err,res){

						//return index sent
						cnn.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
					});
					break;
				
				case "signup":
					login.handle_signup_request(message, function(err,res){

						//return index sent
						cnn.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
					});
					break;

				case "news":
					login.handle_news_request(message, function(err,res){

						//return index sent
						cnn.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
					});
					break;
					
				case "postStatus":
					login.handle_post_news_request(message, function(err,res){

						//return index sent
						cnn.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
					});
					break;

				case "getprofile":
					login.handle_get_profile_request(message, function(err,res){

						//return index sent
						cnn.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
					});
					break;

				case "updatepersonal":
					login.handle_update_personal_request(message, function(err,res){

						//return index sent
						cnn.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
					});
					break;

				case "updateinterests":
					login.handle_update_interests_request(message, function(err,res){

						//return index sent
						cnn.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
					});
					break;

				case "updatesummary":
					login.handle_update_summary_request(message, function(err,res){

						//return index sent
						cnn.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
					});
					break;

				case "showGroups":
					login.handle_show_groups_request(message, function(err,res){

						//return index sent
						cnn.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
					});
					break;

				case "createGrp":
					login.handle_create_group_request(message, function(err,res){

						//return index sent
						cnn.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
					});
					break;

				case "deleteGrp":
					login.handle_delete_group_request(message, function(err,res){

						//return index sent
						cnn.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
					});
					break;

				case "getMembers":
					login.handle_get_members_request(message, function(err,res){

						//return index sent
						cnn.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
					});
					break;

				case "addMember":
					login.handle_add_member_request(message, function(err,res){

						//return index sent
						cnn.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
					});
					break;

				case "removeMember":
					login.handle_remove_member_request(message, function(err,res){

						//return index sent
						cnn.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
					});
					break;

				case "searchFriend":
					login.handle_search_friend_request(message, function(err,res){

						//return index sent
						cnn.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
					});
					break;

				case "newConnection":
					login.handle_new_connection_request(message, function(err,res){

						//return index sent
						cnn.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
					});
					break;

				case "getConnection":
					login.handle_get_connection_request(message, function(err,res){

						//return index sent
						cnn.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
					});
					break;

				case "acceptInvitation":
					login.handle_accept_invitation_request(message, function(err,res){

						//return index sent
						cnn.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
					});
					break;
			}
			
		});
	});

});