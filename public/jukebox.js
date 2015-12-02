var newcode = function() {
	code = document.getElementById('code');
	if (localStorage['code'] === undefined) {
		$.get('/../newcode', function(data, status) {
			console.log(data);
			code.innerHTML = "Your new code is: <a>" + data + "</a>";
			localStorage.setItem("code", data);
		});
	}
	else {
		code.innerHTML = "You just asked for a code! It's: <a>" + localStorage['code'] + "</a>";
	}
	console.log(localStorage['code']);
};

var startqueue = function() {
	queue_message = document.getElementById('queue_message');
	if (localStorage['code'] != undefined) {
		window.location.assign('../queue?code=' + localStorage['code']);
	}
	else {
		queue_message.innerHTML = 'Please click on "Get a New Code" above';
	}
}

$('input').change(function() {
	var $to_send = $(this);
	var code = $to_send[0]['value'];
	
	console.log(code);
})