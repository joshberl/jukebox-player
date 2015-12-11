$('input').change(function() {
	submit_search();
	$('input').val('');
});

var submit_search = function() {
	var queue = document.getElementById('queue');
	var search_item = document.getElementsByName('searchbar')[0].value;
	$.get('/searchsong?song=' + search_item, function(data, status) {
		if (data == "") {
			queue.innerHTML = "No results found";
		}
		else {
			queue.innerHTML = data;
		}
	});
};

// var searchsong = function(req, res) {
// 	var song = req.query.song;
// 	if (song != "") {
// 		spotify.search({ type: 'track', query: song }, function(err, data) {
// 			if (!err) {
// 				var text = "";
// 				var queuesongs = [];
// 			    for (x in data['tracks']['items']) {
// 			    	var queuetitle = data['tracks']['items'][x]['name'];
// 			    	var queueartist = data['tracks']['items'][x]['artists'][0]['name'];
// 			    	var queueobj = {"title": queuetitle, "artist": queueartist}
// 			    	queuesongs.push(queueobj);
// 			    	text += data['tracks']['items'][x]['name'] + " – " + data['tracks']['items'][x]['artists'][0]['name'] + "<br>"; 
// 			    	// console.log(data['tracks']['items'][x]['name']);
// 			    	// console.log(data['tracks']['items'][x]['album']['name']);
// 			    	// console.log(data['tracks']['items'][x]['artists'][0]['name']);
// 			    	// i++;
// 			    }
// 			    console.log(queuesongs);
// 			    res.status(200);
// 			    res.send(text);
// 			}
// 			else {
// 				res.status(200);
// 				res.send("An error occurred, please try again");
// 			}
// 		});
// 	}
// 	else {
// 		res.status(200);
// 		res.send("Please enter something to search");
// 	}
// };
