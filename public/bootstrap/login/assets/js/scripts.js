
jQuery(document).ready(function() {
    if (screen.width >= 480) {
    	$.backstretch("bootstrap/login/assets/img/backgrounds/Homepage_bg.jpg");
    }
    else {
    	document.body.style.backgroundImage = "url('/../bootstrap/login/assets/img/backgrounds/Homepage_bg.jpg')";
    	document.body.style.backgroundRepeat = "repeat-y";
    	var skipper = document.getElementById('skipper');
    	if (skipper != null) {
    		skipper.style.paddingTop = '60px';
    	}
    }

});
