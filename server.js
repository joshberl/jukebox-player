/*Server for Jukebox*/

var express = require('express');
var bodyParser = require('body-parser');
var validator = require('validator');
var spotify = require('spotify');

var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var code_array = [];

var new_code = function() {
    var code = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(var i=0; i < 5; i++) {
        code += possible.charAt(Math.floor(Math.random() * possible.length));
    }
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

var validcode = function(code) {
	for (x in code_array) {
		if (code == code_array[x]) {
			return true;
		}
	}
	return false;
}

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

app.get('/validcode', function(req, res) {
	var code = req.query.code;

	var valid = validcode(code);

	res.status(200);
	if (valid) {
		res.send('is valid');
	}
	else {
		res.send('not valid');
	}
});

app.get('/queue', function(req, res) {
	var code = req.query.code;

	var valid = validcode(code);

	//check to see if the code is in code_array/database (?)

	//if it's not found return some sort of error message, tell user to generate a new code

	//if it is found...

	// var fileText = "";
	var options = {
		root: __dirname,
		dotfiles: 'deny'
	};
	// fileText += '<html><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Login Page</title><!-- CSS --><link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:400,100,300,500"><link rel="stylesheet" href="bootstrap/login/assets/bootstrap/css/bootstrap.min.css"><link rel="stylesheet" href="bootstrap/login/assets/font-awesome/css/font-awesome.min.css"><link rel="stylesheet" href="bootstrap/login/assets/css/form-elements.css"><link rel="stylesheet" href="bootstrap/login/assets/css/style.css"><link rel="stylesheet" href="custom-style.css"><!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries --><!-- WARNING: Respond.js doesnt work if you view the page via file:// --><!--[if lt IE 9]><script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script><script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script><![endif]--><!-- Favicon and touch icons --><link rel="shortcut icon" href="bootstrap/login/assets/ico/favicon.png"><link rel="apple-touch-icon-precomposed" sizes="144x144" href="bootstrap/login/assets/ico/apple-touch-icon-144-precomposed.png"><link rel="apple-touch-icon-precomposed" sizes="114x114" href="bootstrap/login/assets/ico/apple-touch-icon-114-precomposed.png"><link rel="apple-touch-icon-precomposed" sizes="72x72" href="bootstrap/login/assets/ico/apple-touch-icon-72-precomposed.png"><link rel="apple-touch-icon-precomposed" href="bootstrap/login/assets/ico/apple-touch-icon-57-precomposed.png"></head><body><div class="logo">JukeBox</div><div class="inner-bg"><div class="container"><div class="col-sm-3 col-md-5 pull-right"><form class="navbar-form" role="search"><div class="input-group"><input type="text" class="form-control" placeholder="Find a Song" name="addtoqueue"><div class="input-group-btn"><button class="btn" type="submit"><i class="glyphicon glyphicon-search"></i></button></div></div></form></div><!-- Javascript --><script src="bootstrap/login/assets/js/jquery-2.1.4.min.js"></script><script src="bootstrap/login/assets/bootstrap/js/bootstrap.min.js"></script><script src="bootstrap/login/assets/js/jquery.backstretch.min.js"></script><script src="bootstrap/login/assets/js/scripts.js"></script><script src="jukebox.js"></script><!--[if lt IE 10]><script src="assets/js/placeholder.js"></script><![endif]--></body></html>';
	res.status(200);
	res.sendFile('/public/queue.html', options);

});

app.get('/searchsong', function(req, res) {
	var song = req.query.song;
	if (song != "") {
		spotify.search({ type: 'track', query: song }, function(err, data) {
			if (!err) {
				var text = "";
				var queuesongs = [];
			    for (x in data['tracks']['items']) {
			    	var queueid = data['tracks']['items'][x]['id'];
			    	var queueuri = data['tracks']['items'][x]['uri'];
			    	var queuetitle = data['tracks']['items'][x]['name'];
			    	var queueartist = data['tracks']['items'][x]['artists'][0]['name'];
			    	var queuealbum = data['tracks']['items'][x]['album']['name'];
			    	var queueart = data['tracks']['items'][x]['images'];
			    	var queueobj = {"title": queuetitle, "artist": queueartist, "album": queuealbum, "art": queueart, "id": queueid, "uri": queueuri};
			    	queuesongs.push(queueobj);
			    	text += data['tracks']['items'][x]['name'] + " – " + data['tracks']['items'][x]['artists'][0]['name'] + "<br>"; 
			    	// console.log(data['tracks']['items'][x]['name']);
			    	// console.log(data['tracks']['items'][x]['album']['name']);
			    	// console.log(data['tracks']['items'][x]['artists'][0]['name']);
			    	// i++;
			    }
			    //console.log(queuesongs);
			    res.status(200);
			    res.send(queuesongs);
			}
			else {
				res.status(400);
				res.send("An error occurred, please try again");
			}
		});
	}
	else {
		res.status(200);
		res.send("Please enter something to search");
	}
});

app.listen(app.get('port'), function() {
  	console.log('Jukebox is running on port', app.get('port'));
});

