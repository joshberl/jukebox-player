/*Server for Jukebox*/

var express = require('express');
var bodyParser = require('body-parser');
var validator = require('validator');
var spotify = require('spotify');
var request = require('request');

var app = express();

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/comp20-f2015-team7';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
    db = databaseConnection;
    db.collection('codes').createIndex({'last_added': 1}, {expireAfterSeconds: 14400}); //expire codes after 4 hours since a song was added
    db.collection('locations').createIndex({'created_at': 1}, {expireAfterSeconds: 604800});
    //db.collection('locations').remove({});
});

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var new_code = function() {
    var code = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(var i=0; i < 5; i++) {
        code += possible.charAt(Math.floor(Math.random() * possible.length));
    }
	return code;
};

//insertion sort because yay sorting as we insert things
var addnewsong = function(array, new_song) {
	array.push(new_song);
	return array;
}

app.get('/', function(req, res) {
	var options = {
		root: __dirname,
		dotfiles: 'deny'
	};
	res.status(200);
	res.sendFile('index.html', options);

});

app.get('/locations', function(req, res) {
	var options = {
		root: __dirname,
		dotfiles: 'deny'
	};
	res.status(200);
	res.sendFile('public/locations.html', options);
});

app.post('/addlocation', function(req, res) {
	var lat = Number(req.body.lat);
	var lng = Number(req.body.lng);

	if (lat <= 90 && lat >= -90 && lng <= 180 && lng >= -180) {
		var newloc = {
			"lat": lat,
			"lng": lng,
			"created_at": new Date()
		};
		var locations = db.collection('locations');
		locations.insertOne(newloc);
		locations.find({}).toArray(function(err, arr) {
			if (!err) {
				res.status(200);
				res.send(arr);
			}
			else {
				res.status(500);
				res.send("Oops! Something went wrong.");
			}
		});
	}
	else {
		res.status(400);
		res.send("Lat and Lng were not valid.");
	}
});

app.get('/newcode', function(req, res) {
	// var code = new_code(); //some random string or random number for a code?
	var codes = db.collection('codes');
	var code = new_code()
	codes.find({'code': code}).toArray(function(err, arr) {
		if (!err) {
			if (arr[0] != null) {
				res.status(200);
				res.send("An error occurred, please try again.");
			}
			else {
				var to_insert = {
				"code": code,
				"queue": [],
				"last_added": new Date()
				}
				codes.insertOne(to_insert);
				console.log(to_insert);
				res.status(200);
				res.send(code);
			}
		}
	});
});

app.get('/validcode', function(req, res) {
	var code = req.query.code;
	var codes = db.collection('codes');

	codes.find({"code": code}).toArray(function(err, arr) {
		if (!err) {
			res.status(200);
			if (arr[0] == null) {
				res.send('not valid');
			}
			else {
				res.send('is valid');
			}
		}
		else {
			res.status(500);
			res.send('Oops! Something went wrong');
		}
	});
});

app.get('/currentqueue', function(req, res) {
	var code = req.query.code;
	var codes = db.collection('codes');

	codes.find({"code": code}).toArray(function(err, arr) {
		if (!err) {
			res.status(200);
			res.send(arr[0]);
		}
		else {
			res.status(500);
			res.send("Oops! Something went wrong!");
		}
	});
});

app.get('/queue', function(req, res) {
	//HAVE TO DEAL WITH SPOTIFY AUTHENTICATION
	var code = req.query.code;
	var codes = db.collection('codes');

	codes.find({"code": code}).toArray(function(err, arr) {
		if (!err) {
			var options = {
				root: __dirname,
				dotfiles: 'deny'
			};
			res.status(200);
			if (arr[0] == null) {
				res.sendFile('/public/index.html', options);
			}
			else {
				res.sendFile('/public/queue.html', options);
			}
		}
		else {
			res.status(500);
			res.send('Oops! Something went wrong');
		}
	});
});

app.get('/userqueue', function(req, res) {
	var code = req.query.code;
	var codes = db.collection('codes');

	codes.find({"code": code}).toArray(function(err, arr) {
		if (!err) {
			var options = {
				root: __dirname,
				dotfiles: 'deny'
			};
			res.status(200);
			if (arr[0] == null) {
				res.sendFile('/public/index.html', options);
			}
			else {
				res.sendFile('/public/userqueue.html', options);
			}
		}
		else {
			res.status(500);
			res.send('Oops! Something went wrong');
		}
	});
});

app.get('/addsong', function(req, res) {
	var songid = req.query.id;
	var code = req.query.code;
	var codes = db.collection('codes');
	request.get('https://api.spotify.com/v1/tracks/' + songid, function(err, response, body) {
    	if (!err && response.statusCode == 200) {
    		data = JSON.parse(response.body);
	 		var queueid = data['id'];
	    	var queueuri = data['uri'];
	    	var queuetitle = data['name'];
	    	var queueartist = data['artists'][0]['name'];
	    	var queuealbum = data['album']['name'];
	    	var queueart = data['album']['images'];
	    	var queueobj = {"title": queuetitle, "artist": queueartist, "album": queuealbum, "art": queueart, "id": queueid, "uri": queueuri, "count": 1};

	    	codes.find({'code': code}).toArray(function(err, arr) {
	    		console.log(code);
	    		if (!err) {
	    			if (arr[0] != null) {
	    				var array = arr[0].queue;
	    				array = addnewsong(array, queueobj);
	    				var new_data = {
	    					'code': code,
	    					'queue': array,
	    					'last_added': new Date()
	    				}
	    				codes.update({'code':code}, {$set: new_data}, {upsert: true});
	    				codes.find({'code': code}).toArray(function(err, arr) {
	    					if (!err) {
	    						console.log(arr[0]);
	    						res.status(200);
	    						res.send(arr[0]);
	    					}
	    				});
	    			}
	    		}
	    	});

    	}
		else if (err) {
			res.status(400);
			res.send("An error occurred, please try again");
		}
	});
});

app.get('/searchsong', function(req, res) {
	var song = req.query.song;
	if (song != "") {
		spotify.search({ type: 'track', query: song }, function(err, data) {
			if (!err) {
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
			    }
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

app.get('/skipsong', function(req, res) {
	var code = req.query.code;

	var codes = db.collection('codes');
	codes.find({'code': code}).toArray(function(err, arr) {
		if (!err) {
			var queue = arr[0]['queue'];
			queue.shift();
			var updated = {
				'code': code,
				'queue': queue,
				'last_added': arr[0]['last_added']
			};
			codes.update({'code':code}, {$set: updated}, {upsert: true});
			codes.find({'code': code}).toArray(function(err, arr) {
	    		if (!err) {
					res.status(200);
					res.send(arr[0]);
	    		}
	    		else {
	    			res.status(500);
	    			res.send('Oops! Something went wrong!');
	    		}
	    	});
		}
		else {
			res.status(500);
			res.send('Oops! Something went wrong!');
		}
	});
})

app.listen(app.get('port'), function() {
  	console.log('Jukebox is running on port', app.get('port'));
});

