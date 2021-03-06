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
//console.log('process.env.OPENSHIFT_MONGODB_DB_HOST - %s',process.env.OPENSHIFT_MONGODB_DB_HOST);
mongoose.connect('mongodb://admin:bi5CeQ5_fz6D@172.30.182.175:27017/fantasyleague');//Cluster IP
//mongoose.connect('mongodb://admin:bi5CeQ5_fz6D@10.129.158.152:27017/fantasyleague',{auth:{authdb:"admin"}});//Pod IP
//var conStr = 'mongodb://admin:bi5CeQ5_fz6D@'+process.env.OPENSHIFT_MONGODB_DB_HOST+':27017/fantasyleague';
//mongoose.connect(conStr);
//mongoose.connect('mongodb://admin:bi5CeQ5_fz6D@'||mongoHost||':27017/fantasyleague',{auth:{authdb:"admin"}});
//mongoose.connect(process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL);
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

app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('ip', process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1');
app.set('mongodbhost', process.env.OPENSHIFT_MONGODB_DB_HOST);

http.createServer(app).listen(app.get('port') ,app.get('ip'), function () {
    console.log("Express server listening at %s:%d ", app.get('ip'),app.get('port'));
    console.log("process env test %s", process.env.PORT);
    console.log("process env test %s", process.env.OPENSHIFT_NODEJS_PORT);
    console.log("process.env.OPENSHIFT_MONGODB_DB_HOST %s", app.get('mongodbhost'));
});
