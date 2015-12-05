$('input').change(function() {
	submit_search();
	$('input').val('');
});

var submit_search = function() {
	var queue = document.getElementById('queue');
	var search_item = document.getElementsByName('searchbar')[0].value;
	console.log(search_item);
	$.get('../searchsong?song=' + search_item, function(data, status) {
		queue.innerHTML = data;
	});
};