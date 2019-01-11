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
	}

	changeMap(map) {
		this.currentMap = map;
		this.player = new Player(50, 50, this.context);
	}

	runLevel(difficulty, levelNumber) {
		this.levelRunning = true;
		this.levelRunner.run(this.levelGenerator.getRandomLevel(), difficulty, levelNumber);
	}

	endLevel(result) {
		this.levelRunning = false;
		if (result.success) {
			console.log(result);
		} else {
			console.log('salam');
		}
	}

	async init() {
		await this.loadMap(this);

		await this.loadTextures();

		await this.levelRunner.init();

		await this.levelGenerator.init();

		this.changeMap(0);

		this.isReady = true;
	}

	draw() {
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

			this.gameMap[this.currentMap].levels.forEach(element => {
				this.context.fillStyle = 'yellow';
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
				this.textures[this.player.hearts > i ? 0 : 1],
				25 + (25 + bottomMenuInfoSize) * i,
				bottomMenuStart + WindowHeight,
				bottomMenuInfoSize,
				bottomMenuInfoSize
			);
		}

		this.context.fillStyle = 'yellow';
		this.context.font = bottomMenuInfoSize + 'px ArcadeRegular';

		let scoreString = this.player.score.toString();

		while (scoreString.length < 6) scoreString = '0' + scoreString;

		this.context.fillText(
			'SCORE: ' + scoreString,
			WindowWidth - 7 * bottomMenuInfoSize,
			WindowHeight + BottomMenuHeight - bottomMenuStart - bottomMenuInfoSize / 3
		);
	}

	update() {
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
			} else this.horizontalSpeed -= this.horizontalSpeed / 5;

			if (this.verticalSpeed >= -1 && this.verticalSpeed <= 1) {
				this.verticalSpeed = 0;
			} else this.verticalSpeed -= this.verticalSpeed / 5;
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

	input(key) {
		if (this.levelRunning) {
			this.levelRunner.input(key);
		} else {
			if (key == 13) {
				let level = checkCollision(this.player, this.gameMap[this.currentMap].levels);
				if (level != -1) {
					this.runLevel(
						this.gameMap[this.currentMap].levels[level].difficulty,
						this.gameMap[this.currentMap].levels[level].number
					);
				}
			} else {
				this.playerInput(key);
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
}
