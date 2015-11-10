var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , home = require('./routes/home')
  , path = require('path')
  , session = require('client-sessions');

var app = express();

app.use(session({

	cookieName : 'session',
	secret : 'asdfghjklQWERTYUIOPzxcvbnm',
	duration : 30 * 60 * 1000,
	activeDuration : 5 * 60 * 1000,
}));

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.cookieParser());

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', home.signOut);
app.get('/home', home.homePage);
app.get('/homePage', home.homePage);
app.get('/signin',home.facebookhome);
app.get('/signup', home.signup);
app.get('/editProf',home.getHome);
app.get('/profilePage', home.profilePage);
//app.get('/signOut',home.signOut);
app.get('/sessionGet', home.getSession);
app.get('/connections', home.conns);
app.get('/groups', home.groups);
app.get('/searchResults', home.dispSearch);
app.get('/sessionGet', home.getSession);
app.get('/profileGet', home.getProfile);
app.get('/getProfilePage', home.getprofilePage);
app.get('/disProfilePage',home.disProfilePage);
app.get('/dispGrp',home.dispGrp);

//app.post('/home',home.testsignin);
//app.post('/afterSignUp',home.testsignup);
app.post('/home', home.afterSignIn);
app.post('/afterSignUp', home.afterSignUp);
app.post('/homeData', home.getHome);
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

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
