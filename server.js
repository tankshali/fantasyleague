var debug = require('debug')('fantasyleague');
var http = require('http');
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
//initialize mongoose schemas
require('./models/models');
var index = require('./routes/index');
var api = require('./routes/api');
var authenticate = require('./routes/authenticate')(passport);
var mongoose = require('mongoose');    
var url = 'mongodb://admin:bi5CeQ5_fz6D@'||process.env.OPENSHIFT_MONGODB_DB_HOST||':'||process.env.OPENSHIFT_MONGODB_DB_PORT||'/fantasyleague';
mongoose.connect('mongodb://admin:bi5CeQ5_fz6D@172.30.1.67:27017/fantasyleague',{auth:{authdb:"admin"}});            //connect to Mongo
var app = express();

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(__dirname + '/public'));     //serve static assets
app.use('/scripts', express.static(__dirname + '/node_modules/'));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/auth', authenticate);
app.use('/api', api);

// Initialize Passport
var initPassport = require('./passport-init');
initPassport(passport);  

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");

http.createServer(app).listen(app.get('port') ,app.get('ip'), function () {
    console.log("Express server listening at %s:%d ", app.get('ip'),app.get('port'));
});
