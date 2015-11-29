/*Server for Jukebox*/

var express = require('express');
var bodyparser = require('body-parser');
var validator = require('validator');

var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	var options = {
		root: __dirname,
		dotfiles: 'deny'
	};
	res.status(200);
	res.sendFile('index.html', options);
})

app.get('/newcode', function(req, res) {
	var code = String(0); //some random string or random number for a code?
	res.status(200);
	res.send(code);
});

app.listen(app.get('port'), function() {
  	console.log('Jukebox is running on port', app.get('port'));
});