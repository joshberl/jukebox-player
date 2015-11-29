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
	var code = String(0);
	var code_is_being_used = false;
	for (x in code_array) {
		if (x === code) {
			code_is_being_used = true;
			break;
		}
	}
	// if (code_is_being_used) {
	// 	code = new_code();
	// }
	// else if (!code_is_being_used) {
		//add the code to the code_array
		return code;
	// }
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

app.listen(app.get('port'), function() {
  	console.log('Jukebox is running on port', app.get('port'));
});

