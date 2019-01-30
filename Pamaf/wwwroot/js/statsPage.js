window.onload = function() {
	let request = getAllSessions();

	request.onload = function(e) {
		let sessions = JSON.parse(request.responseText);

		let userSessions = sessions.filter(
			f => f.user.facebookId == window.localStorage.getItem('userId') && f.score != 0
		);

		let friends = JSON.parse(localStorage.getItem('friends'));

		let numberOfGames = userSessions.length;
		let gamesWon = userSessions.filter(f => f.levels.length == NumberOfLevels).length;
		let highScore = 0;
		let averageScore = 0;
		let leaderboardPlace = 0;
		let startedPlaying = '--';

		if (userSessions.length != 0) {
			highScore = userSessions.reduce((r1, r2) => (r1.score > r2.score ? r1 : r2)).score;

			averageScore =
				userSessions.reduce(function(a, b) {
					return a + b.score;
				}, 0) / userSessions.length;

			let sortedSessions = sessions.sort((s1, s2) => s2.score - s1.score);

			leaderboardPlace = 0;
			for (let i = 0; i < sortedSessions.length - 1; i++)
				if (sortedSessions[i].user.facebookId == window.localStorage.getItem('userId')) {
					leaderboardPlace = i + 1;
					break;
				}

			startedPlaying = new Date(
				userSessions.reduce((r1, r2) => (r1.date < r2.date ? r1 : r2)).date
			);
		}

		document.getElementById('numberOfGames').innerText = numberOfGames;
		document.getElementById('gamesWon').innerText = gamesWon;
		document.getElementById('highScore').innerText = highScore;
		document.getElementById('averageScore').innerText = Math.floor(averageScore);
		document.getElementById('leaderboardPlace').innerText = leaderboardPlace;
		document.getElementById('startedPlaying').innerText =
			startedPlaying.getDate() +
			'-' +
			(startedPlaying.getMonth() + 1) +
			'-' +
			startedPlaying.getFullYear();
		document.getElementById('friendsNumber').innerText = friends.length;

		var items = document.getElementById('friends-list');

		items.innerHTML = '';

		for (let i = 0; i < 10 && i < friends.length; i++) {
			var item = document.createElement('DIV');
			item.classList.add('friend');

			var itemName = document.createElement('SPAN');
			itemName.classList.add('friend-name');
			itemName.innerHTML = friends[i].name;

			let friendSessions = sessions.filter(f => f.user.facebookId == friends[i].id);

			var itemValue = document.createElement('SPAN');
			itemValue.classList.add('friend-score');
			itemValue.innerHTML =
				friendSessions.length == 0
					? 0
					: friendSessions.reduce((r1, r2) => (r1.score > r2.score ? r1 : r2)).score;

			item.appendChild(itemName);
			item.appendChild(itemValue);
			items.appendChild(item);
		}
	};

	request.send(null);
};
