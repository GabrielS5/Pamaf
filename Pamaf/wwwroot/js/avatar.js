var avatarMenuVisible = false;

document.getElementById('avatar').addEventListener('click', function(e) {
	if (avatarMenuVisible) {
		document.getElementById('avatar-menu').classList.add('hidden');
	} else {
		document.getElementById('avatar-menu').classList.remove('hidden');
	}
	avatarMenuVisible = !avatarMenuVisible;
});

document.getElementById('logout').addEventListener('click', function(e) {
	logout();
	window.location.replace('../html/login.html');
});

document.getElementById('login').addEventListener('click', function(e) {
	window.location.replace('../html/login.html');
});

document.getElementById('stats').addEventListener('click', function(e) {
	window.location.replace('../html/stats.html');
});

document.getElementById('profile').addEventListener('click', function(e) {
	window.location.replace('../html/profile.html');
});

if (window.localStorage.getItem('isAuthenticated') === 'true') {
	document.getElementById('login').classList.add('hidden');
} else {
	document.getElementById('logout').classList.add('hidden');
	document.getElementById('profile').classList.add('hidden');
	document.getElementById('stats').classList.add('hidden');
}
