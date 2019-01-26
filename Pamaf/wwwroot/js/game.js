class Game {
	constructor(canvas, context, levelGenerator) {
		this.canvas = canvas;
		this.context = context;
		this.isReady = false;
		this.gameMap = null;
		this.levelGenerator = levelGenerator;
		this.levelRunner = new LevelRunner(this, context);
		this.levelRunning = false;
		this.x = 0;
		this.y = 0;
		this.horizontalSpeed = 0;
		this.verticalSpeed = 0;
		this.gameSession = null;
		this.endMenuRunning = false;
		this.endMenuRunner = new EndMenuRunner(this, context);
		this.startMenuRunning = true;
		this.startMenuRunner = new StartMenuRunner(this, context);
		this.toMainMenu();
	}

	changeMap(map) {
		this.currentMap = map;
		this.player = new Player(this.context);
		this.x = -this.player.x + this.gameMap[this.currentMap].playerPosition.x;
		this.y = -this.player.y + this.gameMap[this.currentMap].playerPosition.y;
	}

	toMainMenu() {
		this.startMenuRunning = true;
		this.endMenuRunning = false;
		this.startMenuRunner.run();
	}

	startGameFromMenu(gameSession) {
		this.gameSession = gameSession;
		this.changeMap(this.computeCurrentMap(this.gameSession.levels));
		this.startMenuRunning = false;
		this.endMenuRunning = false;
	}

	runLevel(difficulty, levelNumber) {
		this.levelRunning = true;
		this.levelRunner.run(this.levelGenerator.getRandomLevel(), difficulty, levelNumber);
	}

	endLevel(result) {
		this.levelRunning = false;
		addTime(this.gameSession.id, result.timeElapsed);
		this.gameSession.time += result.timeElapsed;
		if (result.success) {
			completeLevel(this.gameSession.id, this.gameSession.score, result.levelNumber);
			this.gameSession.levels.push({ levelNumber: result.levelNumber });
		} else {
			if (result.timeElapsed == LevelTime) this.loseHeart();
			if (this.gameSession.hearts < 0) {
				this.endGame();
			}
		}
	}

	endGame() {
		finishSession(this.gameSession.id, this.gameSession.score);
		this.endMenuRunning = true;
		this.endMenuRunner.run(this.gameSession);
		delete this.gameSession;
		this.getGameSession(this);
	}

	async init() {
		await this.startMenuRunner.init();

		await this.loadMap(this);

		await this.loadTextures();

		await this.levelRunner.init();

		await this.levelGenerator.init();

		await this.endMenuRunner.init();

		this.isReady = true;
	}

	draw() {
		if (this.startMenuRunning) {
			this.startMenuRunner.draw();
		} else if (this.endMenuRunning) {
			this.endMenuRunner.draw();
		} else if (this.gamePaused) {
			this.context.fillStyle = 'yellow';
			this.context.font = 75 + 'px ArcadeRegular';
			this.context.lineWidth = 3;
			this.context.strokeStyle = 'black';
			this.context.fillText('PAUSED', WindowWidth / 2 - 125, WindowHeight / 2);
			this.context.strokeText('PAUSED', WindowWidth / 2 - 125, WindowHeight / 2);
		} else {
			this.canvas.getContext('2d').clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.context.fillStyle = 'white';
			this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
			if (this.levelRunning) {
				this.levelRunner.draw();
			} else {
				this.gameMap[this.currentMap].walls.forEach(element => {
					this.context.fillStyle = 'brown';
					this.context.fillRect(
						element.x - this.x,
						element.y - this.y,
						element.width,
						element.height
					);
				});

				this.context.fillStyle = 'blue';
				this.context.fillRect(
					this.gameMap[this.currentMap].exitZone.x - this.x,
					this.gameMap[this.currentMap].exitZone.y - this.y,
					this.gameMap[this.currentMap].exitZone.width,
					this.gameMap[this.currentMap].exitZone.height
				);

				this.gameMap[this.currentMap].levels.forEach(element => {
					if (levelIsComplete(element, this.gameSession.levels)) this.context.fillStyle = 'green';
					else this.context.fillStyle = 'yellow';

					this.context.fillRect(
						element.x - this.x,
						element.y - this.y,
						element.width,
						element.height
					);
				});

				this.player.draw();
			}

			this.context.fillStyle = 'rgb(10,80,150)';
			this.context.fillRect(0, WindowHeight, this.canvas.width, BottomMenuHeight);

			let bottomMenuStart = BottomMenuHeight / 4;
			let bottomMenuInfoSize = BottomMenuHeight / 2;

			for (let i = 0; i < 3; i++) {
				this.context.drawImage(
					this.textures[this.gameSession.hearts > i ? 0 : 1],
					25 + (25 + bottomMenuInfoSize) * i,
					bottomMenuStart + WindowHeight,
					bottomMenuInfoSize,
					bottomMenuInfoSize
				);
			}

			this.context.fillStyle = 'yellow';
			this.context.font = bottomMenuInfoSize - 10 + 'px ArcadeRegular';

			let scoreString = this.gameSession.score.toString();

			while (scoreString.length < 6) scoreString = '0' + scoreString;

			this.context.fillText(
				'SCORE: ' + scoreString,
				WindowWidth - 7 * (bottomMenuInfoSize - 10),
				WindowHeight + BottomMenuHeight - bottomMenuStart - bottomMenuInfoSize / 3
			);

			if (this.levelRunning) {
				let time = (Math.round(this.levelRunner.timer * 100) / 100).toString();
				this.context.fillStyle = time > 10 ? 'yellow' : 'red';
				this.context.font = bottomMenuInfoSize + 10 + 'px ArcadeRegular';
				this.context.fillText(
					time,
					WindowWidth / 2 - 2 * (bottomMenuInfoSize - 10),
					WindowHeight + BottomMenuHeight - bottomMenuStart - bottomMenuInfoSize / 3
				);
			} else {
				this.context.drawImage(this.textures[2], WindowWidth / 2 - 125, WindowHeight, 250, 100);
			}
		}
	}

	loseHeart() {
		loseHeart(this.gameSession.id);
		this.gameSession.hearts--;
	}

	update() {
		if (this.endMenuRunning || this.startMenuRunning) {
		} else if (!this.gamePaused) {
			if (this.levelRunning) {
				this.levelRunner.update();
			} else {
				if (this.movingRight) {
					this.horizontalSpeed = 10;
				}
				if (this.movingLeft) {
					this.horizontalSpeed = -10;
				}
				if (this.movingUp) {
					this.verticalSpeed = -10;
				}
				if (this.movingDown) {
					this.verticalSpeed = 10;
				}

				this.x += this.horizontalSpeed;
				this.player.updateX(this.x);
				let horizontalCollision = checkCollision(this.player, this.gameMap[this.currentMap].walls);
				if (horizontalCollision != -1) {
					if (this.gameMap[this.currentMap].walls[horizontalCollision].x < this.player.x)
						this.x +=
							this.gameMap[this.currentMap].walls[horizontalCollision].x +
							this.gameMap[this.currentMap].walls[horizontalCollision].width -
							this.player.x +
							0.1;
					else
						this.x -=
							this.player.x +
							this.player.width -
							this.gameMap[this.currentMap].walls[horizontalCollision].x +
							0.1;
					this.player.updateX(this.x);
				}
				this.y += this.verticalSpeed;
				this.player.updateY(this.y);
				let verticalCollision = checkCollision(this.player, this.gameMap[this.currentMap].walls);
				if (verticalCollision != -1) {
					if (this.gameMap[this.currentMap].walls[verticalCollision].y < this.player.y)
						this.y +=
							this.gameMap[this.currentMap].walls[verticalCollision].y +
							this.gameMap[this.currentMap].walls[verticalCollision].height -
							this.player.y +
							0.1;
					else
						this.y -=
							this.player.y +
							this.player.height -
							this.gameMap[this.currentMap].walls[verticalCollision].y +
							0.1;
					this.player.updateY(this.y);
				}

				if (this.horizontalSpeed >= -1 && this.horizontalSpeed <= 1) {
					this.horizontalSpeed = 0;
				} else this.horizontalSpeed -= this.horizontalSpeed / 3;

				if (this.verticalSpeed >= -1 && this.verticalSpeed <= 1) {
					this.verticalSpeed = 0;
				} else this.verticalSpeed -= this.verticalSpeed / 3;
			}
		}
	}

	async loadMap(game) {
		var xobj = new XMLHttpRequest();
		xobj.overrideMimeType('application/json');
		xobj.open('GET', '../json/map.json', false);
		xobj.send(null);
		if (xobj.status == '200') {
			game.gameMap = JSON.parse(xobj.responseText);
		}
	}

	getGameSession(game) {
		let request = getLastSessionAsync(
			window.localStorage.getItem('userId'),
			window.localStorage.getItem('year')
		);

		request.onload = function(e) {
			game.gameSession = JSON.parse(request.responseText);
		};

		request.send(null);
	}

	input(key) {
		if (key == 80) this.gamePaused = !this.gamePaused;
		else if (this.levelRunning) {
			this.levelRunner.input(key);
		} else {
			if (key == 13) {
				let level = checkCollision(this.player, this.gameMap[this.currentMap].levels);
				if (
					level != -1 &&
					!levelIsComplete(this.gameMap[this.currentMap].levels[level], this.gameSession.levels)
				) {
					this.runLevel(
						this.gameMap[this.currentMap].levels[level].difficulty,
						this.gameMap[this.currentMap].levels[level].number
					);
				} else if (checkCollision(this.player, [this.gameMap[this.currentMap].exitZone]) != -1) {
					let nextMap = this.computeCurrentMap(this.gameSession.levels);
					if (this.currentMap != nextMap) {
						if (nextMap != this.gameMap.length) this.changeMap(nextMap);
						else {
							finishSession(this.gameSession.id, this.gameSession.score);
						}
					}
				}
			} else {
				this.playerInput(key);
			}
		}
	}

	mouseInput(click) {
		if (this.endMenuRunning) {
			this.endMenuRunner.input(click);
		} else if (this.startMenuRunning) {
			this.startMenuRunner.input(click);
		} else if (!this.levelRunning) {
			if (
				checkPointCollision(click, [
					{ x: WindowWidth / 2 - 100, y: WindowHeight + 20, width: 200, height: 60 }
				]) != -1
			) {
				this.toMainMenu();
			}
		}
	}

	async loadTextures() {
		this.textures = [];

		let texture = new Image();
		texture.src = '../img/heart.png';
		this.textures.push(texture);

		texture = new Image();
		texture.src = '../img/brokenHeart.png';
		this.textures.push(texture);

		texture = new Image();
		texture.src = '../img/menues/backToMenu.png';
		this.textures.push(texture);
	}

	moveRight(myBool) {
		if (myBool) {
			this.movingRight = true;
			this.movingLeft = false;
		} else {
			this.movingRight = false;
		}
	}

	moveLeft(myBool) {
		if (myBool) {
			this.movingLeft = true;
			this.movingRight = false;
		} else {
			this.movingLeft = false;
		}
	}

	moveUp(myBool) {
		if (myBool) {
			this.movingUp = true;
			this.movingDown = false;
		} else {
			this.movingUp = false;
		}
	}

	moveDown(myBool) {
		if (myBool) {
			this.movingDown = true;
			this.movingUp = false;
		} else {
			this.movingDown = false;
		}
	}

	playerInput(code) {
		switch (code) {
			case 37:
				this.moveLeft(true);
				break;
			case 38:
				this.moveUp(true);
				break;
			case 39:
				this.moveRight(true);
				break;
			case 40:
				this.moveDown(true);
				break;
			case -37:
				this.moveLeft(false);
				break;
			case -38:
				this.moveUp(false);
				break;
			case -39:
				this.moveRight(false);
				break;
			case -40:
				this.moveDown(false);
				break;
		}
	}

	computeCurrentMap(levels) {
		for (let i = 0; i < this.gameMap.length; i++) {
			for (let j = 0; j < this.gameMap[i].levels.length; j++) {
				let levelNumber = this.gameMap[i].levels[j].number;
				if (!levelIsComplete(this.gameMap[i].levels[j], levels)) return i;
			}
		}
		return this.gameMap.length;
	}

	botEaten() {
		this.gameSession.botsEaten++;
		addBotEaten(this.gameSession.id);
	}
}
