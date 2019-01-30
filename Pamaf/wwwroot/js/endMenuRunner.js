class EndMenuRunner {
	constructor(game, context) {
		this.context = context;
		this.game = game;
	}

	async init() {
		this.menuCells = [];
		this.menuButtons = [];
		this.menuCells.push({
			x: 105,
			y: 365,
			width: 175,
			height: 50
		});

		this.menuCells.push({
			x: 358,
			y: 365,
			width: 175,
			height: 50
		});

		this.menuCells.push({
			x: 613,
			y: 365,
			width: 175,
			height: 50
		});

		this.menuCells.push({
			x: 105,
			y: 575,
			width: 175,
			height: 50
		});

		this.menuCells.push({
			x: 358,
			y: 575,
			width: 175,
			height: 50
		});

		this.menuCells.push({
			x: 613,
			y: 575,
			width: 175,
			height: 50
		});

		this.menuButtons.push({
			x: 65,
			y: 760,
			width: 230,
			height: 60,
			action: function(menu) {
				menu.game.toMainMenu();
			}
		});
		this.menuButtons.push({
			x: 600,
			y: 760,
			width: 230,
			height: 60,
			action: function(menu) {
				if (localStorage.getItem('isAuthenticated') === 'true') share();
			}
		});
		this.menuTexture = new Image();
		this.menuTexture.src = '../img/menues/endGameMenu.png';
	}

	run(gameSession) {
		this.gameSession = gameSession;
	}

	draw() {
		this.context.fillStyle = 'rgb(29, 7, 54)';
		this.context.fillRect(0, 0, WindowWidth, WindowHeight + BottomMenuHeight);
		this.context.drawImage(
			this.menuTexture,
			(WindowWidth - 900) / 2,
			(WindowHeight + BottomMenuHeight - 700) / 2,
			900,
			700
		);

		this.writeInCell(0, this.gameSession.score.toString());
		this.writeInCell(1, this.gameSession.levels.length.toString());
		this.writeInCell(
			2,
			Math.floor((this.gameSession.levels.length / NumberOfLevels) * 100).toString() + '%'
		);
		this.writeInCell(3, this.gameSession.botsEaten.toString());
		this.writeInCell(4, this.gameSession.time.toString());
		this.writeInCell(5, this.gameSession.year.toString());

		if (localStorage.getItem('isAuthenticated') === 'false') {
			this.context.beginPath();
			this.context.moveTo(
				this.menuButtons[1].x,
				this.menuButtons[1].y + this.menuButtons[1].height / 2
			);
			this.context.lineTo(
				this.menuButtons[1].x + this.menuButtons[1].width,
				this.menuButtons[1].y + this.menuButtons[1].height / 2
			);
			this.context.strokeStyle = 'black';
			this.context.lineWidth = 3;
			this.context.stroke();
		}
	}

	input(click) {
		let clickedButton = checkPointCollision(click, this.menuButtons);
		if (clickedButton != -1) this.menuButtons[clickedButton].action(this);
	}

	writeInCell(cell, text) {
		this.context.fillStyle = 'yellow';
		this.context.strokeStyle = 'black';
		this.context.lineWidth = 1;
		this.context.font = 50 + 'px ArcadeRegular';
		this.context.fillText(
			text,
			this.menuCells[cell].x + this.menuCells[cell].width / 2 - (text.length * 30) / 2,
			this.menuCells[cell].y + this.menuCells[cell].height
		);
		this.context.strokeText(
			text,
			this.menuCells[cell].x + this.menuCells[cell].width / 2 - (text.length * 30) / 2,
			this.menuCells[cell].y + this.menuCells[cell].height
		);
	}
}
