var ApiLink = 'http://localhost:20000/api';

function login(id) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', ApiLink + '/users/' + id, true);
	xhr.onload = function(e) {
		if (xhr.readyState === 4 && xhr.status === 200) {
			window.localStorage.setItem('userId', id);
			getLastYear(id);
			window.location.replace('../html/home.html');
		} else {
			console.error(xhr.statusText);
		}
	};
	xhr.onerror = function(e) {
		console.error(xhr.statusText);
	};
	xhr.send(null);
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
	xhr.onerror = function(e) {
		console.error(xhr.statusText);
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

function loseHeart(id) {
	var xhr = new XMLHttpRequest();
	xhr.open('POST', ApiLink + '/gamesessions/loseheart/' + id, true);
	xhr.onerror = function(e) {
		console.error(xhr.statusText);
	};
	xhr.send(null);
}

function finishSession(id, score) {
	var xhr = new XMLHttpRequest();
	xhr.open('POST', ApiLink + '/gamesessions/finish/' + id + '/' + score, true);
	xhr.onerror = function(e) {
		console.error(xhr.statusText);
	};
	xhr.send(null);
}

function completeLevel(id, score, levelNumber) {
	var xhr = new XMLHttpRequest();
	xhr.open(
		'POST',
		ApiLink + '/gamesessions/addLevel/' + id + '/' + score + '/' + levelNumber,
		true
	);
	xhr.onerror = function(e) {
		console.error(xhr.statusText);
	};
	xhr.send(null);
}
