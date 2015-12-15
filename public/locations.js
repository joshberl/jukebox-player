var request = new XMLHttpRequest();
var mylat = 0;
var mylong = 0;
var me = new google.maps.LatLng(mylat, mylong);
var myOptions = {
	zoom: 13,
	center: me,
	mapTypeId: google.maps.MapTypeId.ROADMAP
};
var map;
var marker;
var infowindow = new google.maps.InfoWindow();
var lat = 0;
var lng = 0;

function init() {
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	getMyLocation();
}

function getMyLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			mylat = position.coords.latitude;
			mylong = position.coords.longitude;
			renderMap();
		});
	} else {
		alert("Geolocation is not supported by your web browser. What a shame!")
	}
}

function renderMap() {
	me = new google.maps.LatLng(mylat, mylong);
	map.panTo(me);
	marker = new google.maps.Marker({
		position: me,
		title: "You are here!"
	});
	marker.setMap(map);
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(marker.title);
		infowindow.open(map, marker);
	});
	post(mylat, mylong);
}

function post(lat, lng) {
	var url = "https://jukebox-player.herokuapp.com/addlocation";
	var params = "lat=" + lat + "&lng=" + lng;
	request.open("POST", url, true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			data = JSON.parse(request.responseText);
			for (i = 0; i < data.length; i++) {
				new_marker(data[i]);
			}
		}
	}
	request.send(params);
}

function new_marker(data) {	
	lat = data["lat"];
	lng = data["lng"];
	pos = new google.maps.LatLng(lat, lng);
	marker = new google.maps.Marker({
		position: pos,
		map: map
	});
	infowindow = new google.maps.InfoWindow();
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(this.content);
		infowindow.open(map, this);
	});

}