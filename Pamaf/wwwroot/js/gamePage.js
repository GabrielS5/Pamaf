var canvas = document.getElementById('game');

var context = canvas.getContext('2d');

var player = new Player(0, 50, 25, 25, context);

var levelGenerator = new LevelGenerator();

var game = new Game(player, canvas, context, levelGenerator);
game.init();

function gameRunner(game) {
	if (game.isReady) {
		game.update();
		game.draw();
	}
	setTimeout(function() {
		gameRunner(game);
	}, 33);
}

gameRunner(game);

window.addEventListener('keydown', this.onKeyDown, false);
window.addEventListener('keyup', this.onKeyUp, false);

/*
function onKeyDown(e) {
	var code = e.keyCode;
	switch (code) {
		case 37:
			game.player.moveLeft(true);
			break;
		case 38:
			game.player.moveUp(true);
			break;
		case 39:
			game.player.moveRight(true);
			break;
		case 40:
			game.player.moveDown(true);
			break;
		case 13:
			game.runLevel();
			break;
	}
}

function onKeyUp(e) {
	var code = e.keyCode;
	switch (code) {
		case 37:
			game.player.moveLeft(false);
			break;
		case 38:
			game.player.moveUp(false);
			break;
		case 39:
			game.player.moveRight(false);
			break;
		case 40:
			game.player.moveDown(false);
			break;
	}
}
*/

function onKeyDown(e) {
	game.input(e.keyCode);
}

function onKeyUp(e) {
	game.input(-e.keyCode);
}

console.log(game);

setTimeout(function() {
	//console.log(game.levelGenerator.getRandomLevel());
	var maze = game.levelGenerator.getRandomLevel();
	console.log(getCoinMap(maze));
	var guiding = completeMaze(maze, 2,1,2);
	console.log(maze);
	console.log(guiding);
}, 1000);
