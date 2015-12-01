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

