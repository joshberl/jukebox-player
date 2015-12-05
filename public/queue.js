$('input').change(function() {
	submit_search();
	$('input').val('');

	// var queue_attempt = document.getElementById('song_queue');
	// var $to_send = $(this);
	// var code = $to_send[0]['value'];
	// $.get('../validcode?code=' + code, function(data, status) {
	// 	if (data == 'is valid') {
	// 		window.location.assign('../queue?code=' + code);
	// 	}
	// 	else {
	// 		queue_attempt.innerHTML = "Not a valid code. Either enter a valid code or create your own";
	// 		$('input').val('');
	// 	}
	// });
});

var submit_search = function() {
	var queue = document.getElementById('queue');
	var search_item = document.getElementsByName('searchbar')[0].value;
	console.log(search_item);
	$.get('../searchsong?song=' + search_item, function(data, status) {
		queue.innerHTML = data;
	});
};