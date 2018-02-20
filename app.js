var express = require('express');
var index = require('./routes/index');
var api = require('./routes/api');
var app = express();

app.use(express.static(__dirname + '/public'));     //serve static assets
app.use('/scripts', express.static(__dirname + '/node_modules/'));

app.use('/', index);
app.use('/api', api);   

module.exports = app;