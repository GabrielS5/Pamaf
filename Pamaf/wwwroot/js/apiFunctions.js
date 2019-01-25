var ApiLink = 'http://localhost:20000/api';

function login(id, name) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', ApiLink + '/users/' + id + '/' + name, true);
	xhr.onload = function(e) {
		if (xhr.readyState === 4 && xhr.status === 200) {
			var response = JSON.parse(xhr.responseText);
			window.localStorage.setItem('userId', id);
			window.localStorage.setItem('userName', response.facebookName);
			window.localStorage.setItem('isAuthenticated', 'true');
			getLastYear(id);
			window.location.replace('../html/home.html');
		} else {
			console.error(xhr.statusText);
		}
	};
	xhr.send(null);
}

function guestLogin() {
	window.localStorage.setItem('userName', 'Guest');
	window.localStorage.setItem('isAuthenticated', 'false');
	window.location.replace('../html/home.html');
}

function logout() {
	window.localStorage.removeItem('userId');
	window.localStorage.setItem('isAuthenticated', false);
}

function getLastYear(id) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', ApiLink + '/users/' + id + '/year', true);
	xhr.onload = function(e) {
		if (xhr.readyState === 4 && xhr.status === 200) {
			window.localStorage.setItem('year', xhr.responseText);
		} else {
			console.error(xhr.statusText);
		}
	};
	xhr.send(null);
}

function getLastSession(id, year) {
	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType('application/json');
	xobj.open('GET', ApiLink + '/gamesessions/latest/' + id + '/' + year, false);
	xobj.send(null);
	if (xobj.status == '200') {
		return JSON.parse(xobj.responseText);
	}
}

function getAllSessions() {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', ApiLink + '/gamesessions', true);
	return xhr;
}

function loseHeart(id) {
	var xhr = new XMLHttpRequest();
	xhr.open('POST', ApiLink + '/gamesessions/loseheart/' + id, true);
	xhr.send(null);
}

function addTime(id,time) {
	var xhr = new XMLHttpRequest();
	xhr.open('POST', ApiLink + '/gamesessions/addtime/' + id + '/' + time, true);
	xhr.send(null);
}

function addBotEaten(id) {
	var xhr = new XMLHttpRequest();
	xhr.open('POST', ApiLink + '/gamesessions/addbotseaten/' + id, true);
	xhr.send(null);
}

function finishSession(id, score) {
	var xhr = new XMLHttpRequest();
	xhr.open('POST', ApiLink + '/gamesessions/finish/' + id + '/' + score, true);
	xhr.send(null);
}

function completeLevel(id, score, levelNumber) {
	var xhr = new XMLHttpRequest();
	xhr.open(
		'POST',
		ApiLink + '/gamesessions/addLevel/' + id + '/' + score + '/' + levelNumber,
		true
	);
	xhr.send(null);
}

function changeName(id, name) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', ApiLink + '/users/changeName/' + id + '/' + name, true);
	xhr.onload = function(e) {
		if (xhr.readyState === 4 && xhr.status === 200) {
			window.localStorage.setItem('userName', name);
		} else {
			console.error(xhr.statusText);
		}
	};
	xhr.send(null);
}
