class StartMenuRunner {
	constructor(game, context) {
		this.context = context;
		this.game = game;
		this.gameSessions = [];
		this.gameSession = null;
	}

	async init() {
		this.menuCells = [];
		this.menuButtons = [];
		this.howToButtons = [];
		this.changeSessionButtons = [];

		this.menuButtons.push({
			x: 290,
			y: 450,
			width: 320,
			height: 60,
			action: function(menu) {
				menu.gameSession = menu.gameSessions[parseInt(window.localStorage['year']) - 1];
				menu.game.startGameFromMenu(menu.gameSession);
			}
		});

		this.menuButtons.push({
			x: 290,
			y: 565,
			width: 320,
			height: 60,
			action: function(menu) {
				menu.currentMenu = 1;
			}
		});

		this.menuButtons.push({
			x: 290,
			y: 685,
			width: 320,
			height: 60,
			action: function(menu) {
				menu.currentMenu = 2;
			}
		});

		this.howToButtons.push({
			x: 65,
			y: 780,
			width: 110,
			height: 60,
			action: function(menu) {
				menu.currentMenu = 0;
			}
		});

		this.changeSessionButtons.push({
			x: 65,
			y: 780,
			width: 110,
			height: 60,
			action: function(menu) {
				menu.currentMenu = 0;
			}
		});

		this.changeSessionButtons.push({
			x: 165,
			y: 340,
			width: 575,
			height: 90,
			action: function(menu) {
				window.localStorage.setItem('year', '1');
			}
		});

		this.changeSessionButtons.push({
			x: 165,
			y: 470,
			width: 575,
			height: 90,
			action: function(menu) {
				window.localStorage.setItem('year', '2');
			}
		});

		this.changeSessionButtons.push({
			x: 165,
			y: 600,
			width: 575,
			height: 90,
			action: function(menu) {
				window.localStorage.setItem('year', '3');
			}
		});

		this.menuTextures = [];
		let texture = new Image();
		texture.src = '../img/menues/startGameMenu.png';
		this.menuTextures.push(texture);

		texture = new Image();
		texture.src = '../img/menues/howToMenu.png';
		this.menuTextures.push(texture);

		texture = new Image();
		texture.src = '../img/menues/changeSessionMenu.png';
		this.menuTextures.push(texture);

		this.getGameSessions(this);
	}

	run() {
		this.currentMenu = 0;
		this.getGameSessions(this);
	}

	draw() {
		this.context.fillStyle = 'rgb(29, 7, 54)';
		this.context.fillRect(0, 0, WindowWidth, WindowHeight + BottomMenuHeight);
		this.context.drawImage(
			this.menuTextures[this.currentMenu],
			(WindowWidth - 900) / 2,
			(WindowHeight + BottomMenuHeight - 700) / 2,
			900,
			700
		);

		if (this.currentMenu == 2) {
			this.gameSessions.forEach(element => {
				if (parseInt(localStorage.getItem('year')) == element.year) {
					this.context.beginPath();
					this.context.arc(
						this.changeSessionButtons[element.year].x - 50,
						this.changeSessionButtons[element.year].y +
							this.changeSessionButtons[element.year].height / 2,
						20,
						0,
						2 * Math.PI,
						false
					);
					this.context.fillStyle = 'black';
					this.context.fill();

					this.context.beginPath();
					this.context.arc(
						this.changeSessionButtons[element.year].x +
							this.changeSessionButtons[element.year].width +
							50,
						this.changeSessionButtons[element.year].y +
							this.changeSessionButtons[element.year].height / 2,
						20,
						0,
						2 * Math.PI,
						false
					);
					this.context.fillStyle = 'black';
					this.context.fill();
				}
				let percentageText =
					Math.floor((element.levels.length / NumberOfLevels) * 100).toString() + '%';

				percentageText = percentageText.length > 2 ? percentageText : '0' + percentageText;

				let dateText =
					(new Date(element.date).getDate() > 9
						? new Date(element.date).getDate()
						: '0' + new Date(element.date).getDate()) +
					'-' +
					(new Date(element.date).getMonth() + 1 > 9
						? new Date(element.date).getMonth() + 1
						: '0' + (new Date(element.date).getMonth() + 1)) +
					'-' +
					new Date(element.date).getFullYear();

				if (element.time == 0) dateText = '00-00-0000';
				this.context.fillStyle = 'yellow';
				this.context.lineWidth = 1;
				this.context.font = 50 + 'px ArcadeRegular';
				this.context.fillText(
					percentageText + '         ' + dateText,
					this.changeSessionButtons[element.year].x +
						this.changeSessionButtons[element.year].width / 3 -
						30,
					this.changeSessionButtons[element.year].y +
						(this.changeSessionButtons[element.year].height * 2) / 3 +
						5
				);
				this.context.strokeText(
					percentageText + '         ' + dateText,
					this.changeSessionButtons[element.year].x +
						this.changeSessionButtons[element.year].width / 3 -
						30,
					this.changeSessionButtons[element.year].y +
						(this.changeSessionButtons[element.year].height * 2) / 3 +
						5
				);
			});
		}
	}

	input(click) {
		if (this.currentMenu == 0) {
			let clickedButton = checkPointCollision(click, this.menuButtons);
			if (clickedButton != -1) this.menuButtons[clickedButton].action(this);
		} else if (this.currentMenu == 1) {
			let clickedButton = checkPointCollision(click, this.howToButtons);
			if (clickedButton != -1) this.howToButtons[clickedButton].action(this);
		} else if (this.currentMenu == 2) {
			let clickedButton = checkPointCollision(click, this.changeSessionButtons);
			if (clickedButton != -1) this.changeSessionButtons[clickedButton].action(this);
		}
	}

	getGameSessions(startMenu) {
		let request1 = getLastSessionAsync(window.localStorage.getItem('userId'), 1);

		request1.onload = function(e) {
			startMenu.gameSessions[0] = JSON.parse(request1.responseText);
		};

		request1.send(null);

		let request2 = getLastSessionAsync(window.localStorage.getItem('userId'), 2);

		request2.onload = function(e) {
			startMenu.gameSessions[1] = JSON.parse(request2.responseText);
		};

		request2.send(null);
		let request3 = getLastSessionAsync(window.localStorage.getItem('userId'), 3);
		request3.onload = function(e) {
			startMenu.gameSessions[2] = JSON.parse(request3.responseText);
		};

		request3.send(null);
	}
}
