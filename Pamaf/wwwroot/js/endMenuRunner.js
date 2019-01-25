class EndMenuRunner {
	constructor(game, context) {
		this.context = context;
		this.game = game;
	}

	async init() {
		this.menuCells = [];
		this.menuButtons = [];
		this.menuButtons.push({
			x: 65,
			y: 710,
			width: 230,
			height: 60,
			action: function() {
				console.log('Return to main menu');
			}
		});
		this.menuButtons.push({
			x: 332,
			y: 710,
			width: 230,
			height: 60,
			action: function() {
				console.log('restart');
			}
		});
		this.menuButtons.push({
			x: 600,
			y: 710,
			width: 230,
			height: 60,
			action: function() {
				console.log('share');
			}
		});
		this.menuTexture = new Image();
		this.menuTexture.src = '../img/menues/endGameMenu.bmp';
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
			(WindowHeight - 700) / 2,
			900,
			700
		);

		this.menuButtons.forEach(element => {
			this.context.fillRect(element.x, element.y, element.width, element.height);
		});
    }
    
    input(click) {
        console.log(click);
        let clickedButton = checkCollision({x: click.x, y: click.y, width: 5, height: 5}, this.menuButtons);
        console.log(clickedButton);
        if(clickedButton != -1)
            this.menuButtons[clickedButton].action();
    }
}
