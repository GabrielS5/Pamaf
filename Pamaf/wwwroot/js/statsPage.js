window.onload = function() {
	let request = getAllSessions();

	request.onload = function(e) {
		let sessions = JSON.parse(request.responseText);

		let userSessions = sessions.filter(
			f => f.user.facebookId == window.localStorage.getItem('userId')
		);

		// let friends      TO DO

		// let friendsNumber      TO DO

		let numberOfGames = userSessions.length;

		let gamesWon = userSessions.filter(f => f.levels.length == 10).length;

		let highScore = userSessions.reduce((r1, r2) => (r1.score > r2.score ? r1 : r2)).score;

		let averageScore =
			userSessions.reduce(function(a, b) {
				return a + b.score;
			}, 0) / userSessions.length;

		let sortedSessions = sessions.sort((s1, s2) => s2.score - s1.score);

		let leaderboardPlace = 0;
		for (let i = 0; i < sortedSessions.length - 1; i++)
			if (sortedSessions[i].user.facebookId == window.localStorage.getItem('userId')) {
				leaderboardPlace = i + 1;
				break;
			}

		let startedPlaying = new Date(
			userSessions.reduce((r1, r2) => (r1.date < r2.date ? r1 : r2)).date
		);

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
	};

	request.send(null);
};
