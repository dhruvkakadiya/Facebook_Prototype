var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var home = require('./routes/home');
var ajax = require('./routes/ajax');
var session = require('client-sessions');

var app = express();

app.use(session({

	cookieName : 'session',
	secret : 'asdfghjklQWERTYUIOPzxcvbnm',
	duration : 30 * 60 * 1000,
	activeDuration : 5 * 60 * 1000,
}));
// all environments
app.set('port', process.env.PORT || 4500);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.bodyParser());
app.use(express.cookieParser());

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', home.facebookhome);
//app.post('/', home.chkUser);
//app.get('/homePage', home.logIn);
app.get('/ajax', ajax.demo);
app.get('/home', home.homePage);
app.get('/homePage', home.homePage);
app.get('/profilePage', home.profilePage);
app.get('/signup', home.signup);
app.get('/editProf',home.getHome);
app.get('/signOut',home.signOut);
app.get('/connections', home.conns);
app.get('/groups', home.groups);
app.get('/searchResults', home.dispSearch);
app.get('/sessionGet', home.getSession);
app.get('/profileGet', home.getProfile);
app.get('/getProfilePage', home.getprofilePage);
app.get('/disProfilePage',home.disProfilePage);
app.get('/dispGrp',home.dispGrp);

app.post('/home', home.afterSignIn);
app.post('/afterSignUp', home.afterSignUp);
app.post('/homeData', home.getHome);
//app.post('/verifySearch', home.dispSearch);
//app.post('/editProfile', home.editProfile);
app.post('/postStatus',home.postStatus);
app.post('/verifySearch', home.getSearch);
app.post('/updateInterests', home.updateInterests);
app.post('/updatePersonal', home.updatePersonal);
app.post('/updateSummary', home.updateSummary);
app.post('/sendInv', home.newConn);
app.post('/connsNInvs', home.getConns);
app.post('/acceptInv', home.accptInv);
app.post('/showGroups',home.showGroups);
app.post('/createGrp',home.createGrp);
app.post('/deleteGrp',home.deleteGrp);
app.post('/addMember',home.addMember);
app.post('/removeMember',home.removeMember);
app.post('/getMembers',home.getMembers);

app.get('/ajaxDemo', ajax.handleGetReq);
app.post('/ajaxDemo', ajax.handlePostReq);

module.exports = app;

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
