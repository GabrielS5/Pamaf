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
	}, 33);
}

gameRunner(game);

window.addEventListener('keydown', this.onKeyDown, false);
window.addEventListener('keyup', this.onKeyUp, false);

function onKeyDown(e) {
	game.input(e.keyCode);
}

function onKeyUp(e) {
	game.input(-e.keyCode);
}
