var canvas = document.getElementById('game');

var context = canvas.getContext('2d');

var levelGenerator = new LevelGenerator();

var game = new Game(canvas, context, levelGenerator);
game.init();

function gameRunner(game) {
	if (game.isReady) {
		game.update();
		game.draw();
	}
	setTimeout(function() {
		gameRunner(game);
	}, 16);
}

gameRunner(game);

window.addEventListener('keydown', this.onKeyDown, false);
window.addEventListener('keyup', this.onKeyUp, false);

canvas.addEventListener(
	'click',
	function(event) {
		let widthRatio = canvas.offsetWidth / WindowWidth;
		let heightRatio = canvas.offsetHeight / (WindowHeight + BottomMenuHeight);
		let widthMargin =
			heightRatio < widthRatio ? canvas.offsetWidth * (widthRatio - heightRatio) : 0;
		let heightMargin =
			heightRatio > widthRatio ? canvas.offsetHeight * (heightRatio - widthRatio) : 0;

		var rect = canvas.getBoundingClientRect();
		var x = event.clientX - rect.left - widthMargin / 2;
		x *= WindowWidth / (canvas.offsetWidth - widthMargin);
		var y = event.clientY - rect.top - heightMargin / 2;
		y *= (WindowHeight + BottomMenuHeight) / (canvas.offsetHeight - heightMargin);
		game.mouseInput({
			x: x,
			y: y
		});
	},
	false
);

function onKeyDown(e) {
	game.input(e.keyCode);
}

function onKeyUp(e) {
	game.input(-e.keyCode);
}

window.onload = function() {
	createLeaderboard(1);

	document.getElementById('year1Button').addEventListener('click', function(e) {
		createLeaderboard(1);
	});
	document.getElementById('year2Button').addEventListener('click', function(e) {
		createLeaderboard(2);
	});
	document.getElementById('year3Button').addEventListener('click', function(e) {
		createLeaderboard(3);
	});
};

function createLeaderboard(year) {
	let request = getAllSessions();

	request.onload = function(e) {
		let sessions = JSON.parse(request.responseText);

		sessions = sessions.filter(f => f.year == year).sort((s1, s2) => s2.score - s1.score);

		var items = document.getElementById('leaderboard-items');

		items.innerHTML = '';

		for (let i = 0; i < 10 && i < sessions.length; i++) {
			var item = document.createElement('DIV');
			item.classList.add('leaderboard-item');

			var itemName = document.createElement('SPAN');
			itemName.classList.add('leaderboard-item-name');
			itemName.innerHTML = i + 1 + '. ' + sessions[i].user.facebookName;

			var itemValue = document.createElement('SPAN');
			itemValue.classList.add('leaderboard-item-value');
			itemValue.innerHTML = sessions[i].score;

			item.appendChild(itemName);
			item.appendChild(itemValue);
			items.appendChild(item);
		}
	};
	request.send(null);
}
