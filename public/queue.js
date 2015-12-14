$('input').change(function() {
	submit_search();
	$('input').val('');
});

var submit_search = function() {
	var song_search = document.getElementById('song_search');
	var search_item = document.getElementsByName('searchbar')[0].value;
	$.get('/searchsong?song=' + search_item, function(data, status) {
		if (data == "") {
			song_search.innerHTML = "No results found";
		}
		else {
			song_search.innerHTML = parse_songs(data)
		}
	});
};

var parse_songs = function(songlist) {
	var buttons = ""
	for (var i = 0; i < songlist.length; i++) {
		buttons += display_song_data(songlist[i]);
	}
	return buttons;
}

var display_song_data = function(song) {
	//console.log(song);
	if (song) {
		//console.log(song.title);
		var text = "";
		text += (song.title) + " – " + (song.artist) + " - " + (song.album) + "<br>";
		var button = "<button class='scrollthis btn pull-left' onclick=addtoqueue('" + song.id+"')>" + text + "</button>";
		console.log(button);

		return button;
	}
};

var intervalID;
$(".scrollthis").hover(function(){
    var $this = $(this);
    intervalID = setInterval(function() {
       scroll($this);
    }, 100);
}, function() {
    clearInterval(intervalID);
});

function scroll(ele){
    var s = ele.text().substr(1)+ele.text().substr(0,1);
    ele.text(s);
}


var addtoqueue = function(id) {
	var queue = document.getElementById('queue');
	var empty_queue = document.getElementById('empty_queue');
	$.get('/lookupsong?id=' + id, function(data, status) {
		if (empty_queue != null) {
				queue.style.backgroundcolor = "none";
				queue.innerHTML = "<div class=queue_elem style='background-image: url(" + data.art[0].url + ")';><span class='queue_elem_text'>" + data.title + " – " + data.artist + " - " + data.album + "</span></div>";
				console.log(queue.innerHTML);
		}
		else {
			console.log(data);
			queue.innerHTML += "<div class=queue_elem style='background-image: url(" + data.art[0].url + ")';><span class='queue_elem_text'>" + data.title + " – " + data.artist + " - " + data.album + "</span></div>";
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
