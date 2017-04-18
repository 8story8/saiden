// Express Server

var express = require('express');
var app = express();
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret:'bourbon',
    resave: false,
    saveUninitialized: true
}));

var server = app.listen(process.env.PORT || 9000, function(){
    console.log("Express server has started on port 9000");
});

var routes = require('./routes/router.js');
app.use('/', routes);






