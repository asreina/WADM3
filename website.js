var express = require('express');
var fortune = require('./lib/fortune.js');

var app = express();

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

 	app.set('port', process.env.PORT || 3000);

 	app.use(express.static(__dirname + '/public'));

	app.use(function(req, res, next){
		res.locals.showTests = app.get('env') !== 'production' && 
			req.query.test === '1';
		next();
	});

	function getClasses(){
	   return {
	      classes: [
		     {
			  name: 'Web Application Development',
			  courseCode: '',
			  NumberOfCredits: '3',
		          instructor: 'Prof. Voortman',	                  
		     },
		     {
			  name: 'Strategic Planning',
			  courseCode: '',
			  NumberOfCredits: '3',
			  instructor: 'Dr. Bowen',
	             },
                     {
			  name: 'Leadership Seminar: Walt Disney World',
	                  courseCode: '',
			  NumberOfCredits: '3',
			  instructor: 'Prof. Voortman',		          
		     },
		     {
			  name: 'NoSQL',
			  courseCode: '',
			  numberOfCredits: '3',
		          instructor: 'Prof. Seaman',
		     },
	             ],
	       };
	}

	app.use(function(req, res, next){
			if(!res.locals.partials) res.locals.partials = {};
		 	res.locals.partials.weatherContext = getClasses();
		 	next();
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

	app.get('/contact', function(req,res){
		res.render('contact');
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
