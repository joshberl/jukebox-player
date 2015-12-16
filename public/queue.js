$('input').change(function() {
	submit_search();
	$('input').val('');
});

var player_exists = false;

$( document ).ready(function() {
	var search = window.location['search'];
	var code = "";
	for (var i = 0; i < window.location['search'].length; i++) {
		if (search[i+9] == undefined) {
			window.location.assign('/../');
			break;
		}
		// make sure the input matches the code given before proceeding
		if (search[i] == 'c' && search[i+1] == 'o' && search[i+2] == 'd' && search[i+3] == 'e') {
			for (var j = 0; j < 5; j++) {
				code += search[i+j+5];
			}
			if (localStorage['code'] != code) {
				window.location.assign('/../');
			}
			document.getElementById('queueid').innerHTML = "The code for this queue is: <a><span id='code'>" + code + "</span></a>";
			break;
		}
	}

	$.get('/currentqueue?code=' + document.getElementById('code').innerHTML, function(data, status) {
		if (data.queue[0] != null) {
			var queue = document.getElementById('queue');
			queue.innerHTML = "";
			var skipper = document.getElementById('skipper');
			skipper.innerHTML = '<button class="skipbtn" onclick=skip_song()>Skip to Next Song</button>';
			for (var i = 1; i < data.queue.length; i++) {
				queue.innerHTML += "<div class=queue_elem style='background-image: url(" + data.queue[i].art[0].url + ")';><span class='queue_elem_text'>" + data['queue'][i]['title'] + " – " + data['queue'][i]['artist'] + " - " + data['queue'][i]['album'] + "</span></div>";
			}
			load_player(data);
			player_exists = true;
		}
		else if (data.queue[0] == null) {
			var queue = document.getElementById('queue');
			var player_group = document.getElementById('player_group');
			queue.innerHTML = '<div id="empty_queue"><div id="empty_queue_text">Queue currently empty. Search a song to add to the queue.</div></div>';
			player_group.innerHTML = '<div id="player"></div><div id="skipper"></div>';
			player_exists = false;
		}
	});

	window.setInterval(function(){
		$.get('/currentqueue?code=' + document.getElementById('code').innerHTML, function(data, status) {
			if (data.queue[0] != null) {
				var queue = document.getElementById('queue');
				var skipper = document.getElementById('skipper');
				skipper.innerHTML = '<button class="skipbtn" onclick=skip_song()>Skip to Next Song</button>';
				if (data.queue.length == 1) {
					queue.innerHTML = "";
					if (!player_exists) {
						load_player(data);
						player_exists = true;
					};
				}
				else {
					queue.innerHTML = "";
					for (var i = 1; i < data.queue.length; i++) {
						queue.innerHTML += "<div class=queue_elem style='background-image: url(" + data.queue[i].art[0].url + ")';><span class='queue_elem_text'>" + data['queue'][i]['title'] + " – " + data['queue'][i]['artist'] + " - " + data['queue'][i]['album'] + "</span></div>";
					}
				}
			}
			else if (data.queue[0] == null) {
				var queue = document.getElementById('queue');
				var player_group = document.getElementById('player_group');
				queue.innerHTML = '<div id="empty_queue"><div id="empty_queue_text">Queue currently empty. Search a song to add to the queue.</div></div>';
				player_group.innerHTML = '<div id="player"></div><div id="skipper"></div>';
			}
		});
	}, 30000);
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			var userlat = position.coords.latitude;
			var userlng = position.coords.longitude;
			$.post('/addlocation', {lat: userlat, lng: userlng});
		});
	}
});

var skip_song = function() {
	$.get('/skipsong?code=' + document.getElementById('code').innerHTML, function(data, status) {
		if (data.queue[0] != null) {
			var queue = document.getElementById('queue');
			queue.innerHTML = "";
			for (var i = 1; i < data.queue.length; i++) {
				queue.innerHTML += "<div class=queue_elem style='background-image: url(" + data.queue[i].art[0].url + ")';><span class='queue_elem_text'>" + data['queue'][i]['title'] + " – " + data['queue'][i]['artist'] + " - " + data['queue'][i]['album'] + "</span></div>";
			}
			load_player(data);
		}
		else if (data.queue[0] == null) {
			var queue = document.getElementById('queue');
			var player_group = document.getElementById('player_group');
			queue.innerHTML = '<div id="empty_queue"><div id="empty_queue_text">Queue currently empty. Search a song to add to the queue.</div></div>';
			player_group.innerHTML = '<div id="player"></div><div id="skipper"></div>';
			player_exists = false;
		}
	});
}

var submit_search = function() {
	var song_search = document.getElementById('song_search');
	var search_item = document.getElementsByName('searchbar')[0].value;
	$.get('/searchsong?song=' + search_item, function(data, status) {
		if (data == "") {
			song_search.innerHTML = "No results found";
		}
		else {
			song_search.innerHTML = parse_songs(data);
		}
	});
};

var parse_songs = function(songlist) {
	var buttons = ""
	for (var i = 0; i < songlist.length; i++) {
		buttons += display_song_data(songlist[i]);
	}
	return buttons;
};

// adds song text to the button
var display_song_data = function(song) {
	if (song) {
		var text = "";
		text += (song.title) + " – " + (song.artist) + " - " + (song.album) + "<br>";
		var button = "<button class='btn pull-left' onclick=addtoqueue('" + song.id+"')><span class=scrollthis>" + text + "</span></button>";
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
	$.get('/addsong?id=' + id + '&code=' + document.getElementById('code').innerHTML, function(data, status) {
		queue.innerHTML = "";
		for (var i = 1; i < data.queue.length; i++) {
			queue.innerHTML += "<div class=queue_elem style='background-image: url(" + data.queue[i].art[0].url + ")';><span class='queue_elem_text'>" + data['queue'][i]['title'] + " – " + data['queue'][i]['artist'] + " - " + data['queue'][i]['album'] + "</span></div>";
		}
		if (data.queue.length == 1) {
			var skipper = document.getElementById('skipper');
			skipper.innerHTML = '<button class="skipbtn" onclick=skip_song()>Skip to Next Song</button>';
			if (!player_exists) {
				load_player(data);
			}
		}
	});
};

var load_player = function(data) {
	var player = document.getElementById('player');
	player.innerHTML = "";
	var iframe = "<iframe src=\"https://embed.spotify.com/?uri=" + data.queue[0].uri + "\" frameborder=\"0\" allowtransparency=\"true\"></iframe>";
	player.innerHTML += iframe;
}
