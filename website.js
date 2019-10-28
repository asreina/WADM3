var express = require('express');
var fortune = require('./lib/fortune.js');

var app = express();
var formidable = require('formidable');
// set up handlebars view engine
var handlebars = require('express3-handlebars').create({
	defaultLayout:'main',
	helpers:{
		section: function(name, options){
			 if(!this._sections) this._sections = {};
			 this._sections[name] = options.fn(this);
			 return null;
		}
	    }
	});
 	app.engine('handlebars', handlebars.engine);
 	app.set('view engine', 'handlebars');

	app.use(express.static(__dirname + '/public'));
	app.use(require('body-parser').urlencoded({extended:true}));

	var textColors = ['red', 'green', 'yellow', 'white', 'black', 'purple'];

	var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

 	app.set('port', process.env.PORT || 3001);

 	app.use(express.static(__dirname + '/public'));

	app.use(function(req, res, next){
		res.locals.showTests = app.get('env') !== 'production' &&
			req.query.test === '1';
		next();
	});

	app.get('/', function(req, res) {
 res.render('home', {
   people: [
   { name: 'NoSQL', code: 'CMPS 364', num: '3', ins: 'Prof. Seamen' },
   { name: 'Disney Leaderahip Seminar', code: 'BMGT 395', num: '3', ins: 'Prof Voortman' },
   { name: 'Web Application Development', code: 'CMPS 361 EA' ', num: '3', ins: 'Prof Voortman' },
   { name: 'Strategic Planning', code: 'BMGT 417', num: '3', ins: 'Dr Bowen' },
   ], csrf: 'CSRF token goes here'
 });
});

app.get('/datetime', function(req, res){
 var dateTime = date+' '+time;
 res.render('datetime', {datetime: dateTime});
});

app.get('/random', function(req, res){
 var randomColor =
 textColors[Math.floor(Math.random() * textColors.length)];
 res.render('random', {random: randomColor});
});

 	app.get('/', function(req, res) {
 		res.render('home');
 	});

	app.get('/about', function(req,res){
		res.render('about', {
			fortune: fortune.getFortune(),
			pageTestScript: '/qa/tests-about.js'
		} );
	});

	app.get('/thank-you', function(req, res){
		res.render('thank-you');
	});

	app.get('/headers', function(req,res){
	 res.set('Content-Type','text/plain');
	 var s = '';
	 for(var name in req.headers) s += name + ': ' + req.headers[name] + '\n';
	 res.send(s);
	});

	app.get('/tours/hood-river', function(req, res){
	 res.render('tours/hood-river');
	});

	app.get('/tours/request-group-rate', function(req, res){
	 res.render('tours/request-group-rate');
	});

	app.get('/contact', function(req,res){
		res.render('contact');
	});

	app.post('/process', function(req, res){
	    if(req.xhr || req.accepts('json,html')==='json'){
	        res.send({ success: true });
	    } else {
	        console.log('Form (from querystring): ' + req.query.form);
	        console.log('CSRF token (from hidden form field): ' + req.body._csrf);
	        console.log('Name (from visible form field): ' + req.body.name);
	        console.log('Email (from visible form field): ' + req.body.email);
	        console.log('Question (from visible form field): ' + req.body.question);
	        res.redirect(303, '/thank-you');
	    }
	});

 // 404 catch-all handler (middleware)
 	app.use(function(req, res, next){
 		res.status(404);
 		res.render('404');
 	});

 // 500 error handler (middleware)
 	app.use(function(err, req, res, next){
 		console.error(err.stack);
 		res.status(500);
 		res.render('500');
 	});

 	app.listen(app.get('port'), function(){
 	  console.log( 'Express started on http://localhost:' +
 	     app.get('port') + '; press Ctrl-C to terminate.' );
        });
