/*Server for Jukebox*/

var express = require('express');
var bodyParser = require('body-parser');
var validator = require('validator');

var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var code_array = [];

var new_code = function() {
	var code = String(Math.floor((Math.random() * 10000) + 1));
	var code_is_being_used = false;
	for (x in code_array) {
		if (code_array[x] === code) {
			code_is_being_used = true;
			break;
		}
	}
	if (code_is_being_used) {
		code = new_code();
	}
	else if (!code_is_being_used) {
		code_array.push(code);
		return code;
	}
};




app.get('/', function(req, res) {
	var options = {
		root: __dirname,
		dotfiles: 'deny'
	};
	res.status(200);
	res.sendFile('index.html', options);
});

app.get('/newcode', function(req, res) {
	var code = new_code(); //some random string or random number for a code?
	res.status(200);
	res.send(code);
});

app.get('/allcodes', function(req, res) {
	var list = "";
	for (x in code_array) {
		list += code_array[x] + " ";
	}
	res.status(200);
	res.send(list);
});

app.get('/queue', function(req, res) {
	var code = req.query.code;

	//check to see if the code is in code_array/database (?)

	//if it's not found return some sort of error message, tell user to generate a new code

	//if it is found...

	var fileText = "";

	fileText += "<!DOCTYPE html>\n<html>\n<head><title>Queue: " + code + "</title></head><body>Queue: " + code + "</body></html>";
	res.status(200);
	res.send(fileText);

});

//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////*** Bootstrap gets ***//////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////

app.get('/bootstrap/login/assets/bootstrap/css/bootstrap.min.css', function(req, res) {
	var options = {
		root: __dirname,
		dotfiles: 'deny'
	};
	res.status(200);
	res.sendFile('/bootstrap/login/assets/bootstrap/css/bootstrap.min.css', options);
});

app.get('/bootstrap/login/assets/font-awesome/css/font-awesome.min.css', function(req, res) {
	var options = {
		root: __dirname,
		dotfiles: 'deny'
	};
	res.status(200);
	res.sendFile('/bootstrap/login/assets/font-awesome/css/font-awesome.min.css', options);
});

app.get('/bootstrap/login/assets/css/form-elements.css', function(req, res) {
	var options = {
		root: __dirname,
		dotfiles: 'deny'
	};
	res.status(200);
	res.sendFile('/bootstrap/login/assets/css/form-elements.css', options);
});

app.get('/bootstrap/login/assets/css/style.css', function(req, res) {
	var options = {
		root: __dirname,
		dotfiles: 'deny'
	};
	res.status(200);
	res.sendFile('/bootstrap/login/assets/css/style.css', options);
});

app.get('/bootstrap/login/assets/js/jquery-1.11.1.min.js', function(req, res) {
	var options = {
		root: __dirname,
		dotfiles: 'deny'
	};
	res.status(200);
	res.sendFile('/bootstrap/login/assets/js/jquery-1.11.1.min.js', options);
});

app.get('/bootstrap/login/assets/bootstrap/js/bootstrap.min.js', function(req, res) {
	var options = {
		root: __dirname,
		dotfiles: 'deny'
	};
	res.status(200);
	res.sendFile('/bootstrap/login/assets/bootstrap/js/bootstrap.min.js', options);
});

app.get('/bootstrap/login/assets/js/jquery.backstretch.min.js', function(req, res) {
	var options = {
		root: __dirname,
		dotfiles: 'deny'
	};
	res.status(200);
	res.sendFile('/bootstrap/login/assets/js/jquery.backstretch.min.js', options);
});

app.get('/bootstrap/login/assets/js/scripts.js', function(req, res) {
	var options = {
		root: __dirname,
		dotfiles: 'deny'
	};
	res.status(200);
	res.sendFile('/bootstrap/login/assets/js/scripts.js', options);
});

app.get('/bootstrap/login/assets/font-awesome/fonts/fontawesome-webfont.woff2', function(req, res) {
	var options = {
		root: __dirname,
		dotfiles: 'deny'
	};
	res.status(200);
	res.sendFile('/bootstrap/login/assets/font-awesome/fonts/fontawesome-webfont.woff2', options);
});

app.get('/bootstrap/login/assets/img/backgrounds/Homepage_bg.jpg', function(req, res) {
	var options = {
		root: __dirname,
		dotfiles: 'deny'
	};
	res.status(200);
	res.sendFile('/bootstrap/login/assets/img/backgrounds/Homepage_bg.jpg', options);
});

app.get('/bootstrap/login/assets/font-awesome/fonts/fontawesome-webfont.woff', function(req, res) {
	var options = {
		root: __dirname,
		dotfiles: 'deny'
	};
	res.status(200);
	res.sendFile('/bootstrap/login/assets/font-awesome/fonts/fontawesome-webfont.woff', options);
});

app.listen(app.get('port'), function() {
  	console.log('Jukebox is running on port', app.get('port'));
});

