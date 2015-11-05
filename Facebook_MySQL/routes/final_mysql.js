var ejs= require('ejs');
var mysql = require('mysql');

var maxlimit = 10;
var connection_busy_list = [];
var connection_free_list = [];

function getConnection(){
	return new Promise(function(resolve,reject) {
		
		if(connection_busy_list.length+connection_free_list.length==0) {
			for(var i=0;i<maxlimit;i++) {
				var connection = mysql.createConnection({
			    host     : 'localhost',
			    user     : 'root',
			    password : 'donotopen',
			    database : 'test',
			    port	 : 3306
				});		
			}
			connection_free_list.push(connection);
			var n1 = connection_free_list.shift();
			connection_busy_list.push(n1);
			resolve(n1);
		}
		
		else {
			if(connection_free_list.length>0) {
				var n1=connection_free_list.shift();
				connection_busy_list.push(n1);	
				resolve(n1);
			}
			else {
				setTimeout(function() {
					if(connection_free_list.length>0) {
					var n1=connection_free_list.shift();
					connection_busy_list.push(n1);
					console.log('got connection from setTimeout')	
					resolve(n1); 
					}
					return false;
				},500);
			}
			//var connection = function() 
		}
	});
}

function fetchData(callback,sqlQuery){
	
	console.log("\nSQL Query::"+sqlQuery);
	var connection_promise = getConnection();
	connection_promise.then(function(connection){
		connection.query(sqlQuery, function(err, rows, fields) {
		var n1 = connection_busy_list.shift();
		connection_free_list.push(n1);
		if(err){
			console.log("ERROR: " + err.message);
		}
		else 
		{	// return err or result
			console.log("DB Results:"+rows);
			callback(err, rows);
		}
		});
	});
	//console.log("\nConnection closed..");
	//connection.end();
}	

exports.fetchData=fetchData;