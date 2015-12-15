var newcode = function() {
	code = document.getElementById('code');
	var curr = new Date();
	if ((curr - Date.parse(localStorage['timestamp']) > 3600000) || localStorage['timestamp'] === undefined) {
		$.get('/../newcode', function(data, status) {
			code.innerHTML = "Your new code is: <a>" + data + "</a>";
			localStorage.setItem("code", data);
			localStorage.setItem("timestamp", curr);
		});
	}
	else {
		code.innerHTML = "You Already Have a Code: <a>" + localStorage['code'] + "</a>";
	}
};

var startqueue = function() {
	var curr = new Date();
	queue_message = document.getElementById('queue_message');
	if (localStorage['code'] != undefined && curr - Date.parse(localStorage['timestamp']) < 3600000) {
		window.location.assign('../queue?code=' + localStorage['code']);
	}
	else {
		queue_message.innerHTML = 'Please click on "Get a New Code"';
	}
}

$('input').change(function() {
	var queue_attempt = document.getElementById('queue_attempt');
	var $to_send = $(this);
	var code = $to_send[0]['value'];
	$.get('../validcode?code=' + code, function(data, status) {
		if (data == 'is valid') {
			window.location.assign('../userqueue?code=' + code);
		}
		else {
			queue_attempt.innerHTML = "Not a valid code. Either enter a valid code or create your own";
			$('input').val('');
		}
	});
});