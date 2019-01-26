window.fbAsyncInit = function() {
	FB.init({
		appId: '350115898912228',
		cookie: true,
		xfbml: true,
		version: 'v3.2'
	});
};

(function(d, s, id) {
	var js,
		fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) {
		return;
	}
	js = d.createElement(s);
	js.id = id;
	js.src = 'https://connect.facebook.net/en_US/all.js';
	fjs.parentNode.insertBefore(js, fjs);
})(document, 'script', 'facebook-jssdk');

function statusChangeCallback(response) {
	if (response.status === 'connected') {
		getUserCredentials(function(response) {
			getUserFriends(function() {
				getUserProfilePic(function() {
					login(response.id.toString(), response.name);
				});
			});
		});
	} else {
	}
}

function checkLoginState() {
	FB.getLoginStatus(function(response) {
		statusChangeCallback(response);
	});
}

function getUserId() {
	FB.api('/me?fields=id', function(response) {
		if (response && !response.error) {
			console.log(response.id);
		}
	});
}

function getUserCredentials(callback) {
	FB.api('/me?fields=name,id', function(response) {
		if (response && !response.error) {
			callback(response);
		}
	});
}

function getUserFriends(callback) {
	return FB.api('/me?fields=friends', function(response) {
		if (response && !response.error) {
			localStorage.setItem('friends', JSON.stringify(response.friends.data));
			callback();
		}
	});
}

function getUserProfilePic(callback) {
	FB.api('/me?fields=picture.type(large)', function(response) {
		if (response && !response.error) {
			localStorage.setItem('picture', response.picture.data.url);
			callback();
		}
	});
}
function facebookLogout() {
	FB.getLoginStatus(function(response) {
		console.log(response);
		if (response.status === 'connected') {
			FB.logout(function(response) {
				FB.api('/me/permissions', 'delete', function(response) {});
				window.location.replace('../html/login.html');
			});
		} else window.location.replace('../html/login.html');
	});
}
