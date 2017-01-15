var express = require('express'),
	mongoose = require('mongoose'),
	path = require('path'),
	recordRouter = require('../routers/record'),
	config = require('../config');

var app = express();

app.set('view engine', 'pug');
app.set('views', path.resolve(__dirname, '../views'));

app.use('/public', express.static(
	path.resolve(__dirname, '../public')
));

app.use((req, res, next) => {
	 var fullUrl = req.method + ' ' + req.protocol + '://' + req.get('host') + req.originalUrl;
	 console.log(fullUrl);
	 next();
});

app.use('/record', recordRouter);

app.get('/', (req, res) => res.status(200).render('index') );


module.exports = app