class LevelRunner {
	constructor(game, context) {
		this.game = game;
		this.context = context;
		this.level = null;
		this.player = null;
		this.enemies = [];
		this.friendsImages = [];
		this.backgroundColors = [
			'cyan',
			'rgb(0,255,64)',
			'rgb(255,0,255)',
			'rgb(255,128,64)',
			'rgb(255,128,128)',
			'rgb(192,192,192)',
			'rgb(128,128,255)'
		];
	}

	async init() {
		if (localStorage.getItem('isAuthenticated') === 'true') {
			JSON.parse(localStorage.getItem('friends')).forEach(element => {
				getImageFromFacebookId(element.id, this, function(levelRunner, response) {
					levelRunner.friendsImages.push(response.url);
				});
			});
		}
		await this.loadMapTextures(this);
	}

	run(level, difficulty, levelNumber) {
		this.images = getBotImages(this.friendsImages, this.game.gameSession.year);
		this.timer = LevelTime;
		this.difficulty = difficulty;
		this.color = this.backgroundColors[Math.floor(Math.random() * this.backgroundColors.length)];

		if (localStorage.getItem('year') == '1') this.difficulty += 0.1;
		else if (localStorage.getItem('year') == '2') this.difficulty += 0.2;
		else this.difficulty += 0.3;

		this.levelNumber = levelNumber;
		this.level = level;
		let guiding = getGuiding(level);
		this.coinMap = getCoinMap(level);
		this.player = new LevelPlayer(30, 30, 7, this.level, this.context);
		this.enemies = [];
		this.enemies.push(
			new LevelEnemy(
				30,
				30,
				Math.floor(18 - 8 * this.difficulty),
				this.level,
				guiding,
				this.player,
				1,
				this.difficulty,
				this.images[0],
				this.context
			)
		);
		this.enemies.push(
			new LevelEnemy(
				30,
				30,
				Math.floor(18 - 8 * this.difficulty),
				this.level,
				guiding,
				this.player,
				2,
				this.difficulty,
				this.images[1],
				this.context
			)
		);
		this.enemies.push(
			new LevelEnemy(
				30,
				30,
				Math.floor(18 - 8 * this.difficulty),
				this.level,
				guiding,
				this.player,
				3,
				this.difficulty,
				this.images[2],
				this.context
			)
		);
		this.enemies.push(
			new LevelEnemy(
				30,
				30,
				Math.floor(18 - 8 * this.difficulty),
				this.level,
				guiding,
				this.player,
				4,
				this.difficulty,
				this.images[3],
				this.context
			)
		);
	}

	resetLevel() {
		this.player.x = LevelCell;
		this.player.y = LevelCell;
		let guiding = getGuiding(this.level);
		this.enemies = [];
		this.enemies.push(
			new LevelEnemy(
				30,
				30,
				Math.floor(18 - 8 * this.difficulty),
				this.level,
				guiding,
				this.player,
				1,
				this.difficulty,
				this.images[0],
				this.context
			)
		);
		this.enemies.push(
			new LevelEnemy(
				30,
				30,
				Math.floor(18 - 8 * this.difficulty),
				this.level,
				guiding,
				this.player,
				2,
				this.difficulty,
				this.images[1],
				this.context
			)
		);
		this.enemies.push(
			new LevelEnemy(
				30,
				30,
				Math.floor(18 - 8 * this.difficulty),
				this.level,
				guiding,
				this.player,
				3,
				this.difficulty,
				this.images[2],
				this.context
			)
		);
		this.enemies.push(
			new LevelEnemy(
				30,
				30,
				Math.floor(18 - 8 * this.difficulty),
				this.level,
				guiding,
				this.player,
				4,
				this.difficulty,
				this.images[3],
				this.context
			)
		);
	}

	checkEndGame() {
		if (this.timer < 0) {
			this.game.endLevel({
				success: false,
				levelNumber: this.levelNumber,
				timeElapsed: LevelTime
			});
		}
		if (this.game.gameSession.hearts < 0) {
			this.game.endLevel({
				success: false,
				levelNumber: this.levelNumber,
				timeElapsed: Math.floor(LevelTime - this.timer)
			});
		} else {
			if (this.coinMap.filter(f => f.some(s => s != 0)).length == 0) {
				this.game.endLevel({
					success: true,
					levelNumber: this.levelNumber,
					timeElapsed: Math.floor(LevelTime - this.timer)
				});
			}
		}
	}

	update() {
		this.timer -= 1 / FramesPerSecond;
		let pAverageLine = Math.floor((this.player.y + LevelCell / 2) / LevelCell);
		let pAverageColumn = Math.floor((this.player.x + LevelCell / 2) / LevelCell);
		// coins collisions
		if (this.coinMap[pAverageLine][pAverageColumn] == 1) {
			this.game.gameSession.score += 10;
			this.coinMap[pAverageLine][pAverageColumn] = 0;
		} else if (this.coinMap[pAverageLine][pAverageColumn] == 2) {
			this.game.gameSession.score += 100;
			this.coinMap[pAverageLine][pAverageColumn] = 0;
			this.enemies.forEach(enemy => {
				enemy.goChased(Math.floor(300 - 100 * this.difficulty));
			});
		}

		let collision = checkCollision(this.player, this.enemies);
		if (collision != -1) {
			if (this.enemies[collision].mode == 2) {
				this.enemies[collision].goSleep(Math.floor(200 - 100 * this.difficulty));
				this.game.gameSession.score += 200;
				this.game.botEaten();
			} else {
				this.game.loseHeart();
				this.resetLevel();
			}
		}

		this.player.update();

		this.enemies.forEach(enemy => {
			enemy.update();
		});

		this.checkEndGame();
	}

	getTexture(line, column) {
		if (column == 0 && line == this.level.length - 1) return this.mapTextures[8];
		if (column == 0 && line == 0) return this.mapTextures[9];
		if (column == this.level[0].length - 1 && line == 0) return this.mapTextures[10];
		if (column == this.level[0].length - 1 && line == this.level.length - 1)
			return this.mapTextures[11];
		let neighborString = '';

		neighborString += column < this.level[0].length - 1 ? this.level[line][column + 1] : 0;
		neighborString +=
			column < this.level[0].length - 1 && line < this.level.length - 1
				? this.level[line + 1][column + 1]
				: 0;
		neighborString += line < this.level.length - 1 ? this.level[line + 1][column] : 0;
		neighborString +=
			column > 0 && line < this.level.length - 1 ? this.level[line + 1][column - 1] : 0;
		neighborString += column > 0 ? this.level[line][column - 1] : 0;
		neighborString += column > 0 && line > 0 ? this.level[line - 1][column - 1] : 0;
		neighborString += line > 0 ? this.level[line - 1][column] : 0;
		neighborString +=
			column < this.level[0].length - 1 && line > 0 ? this.level[line - 1][column + 1] : 0;

		if (column == 0) {
		}

		if (neighborString == '01111100') return this.mapTextures[0];
		else if (neighborString == '00011111') return this.mapTextures[1];
		else if (neighborString == '11000111') return this.mapTextures[2];
		else if (neighborString == '11110001') return this.mapTextures[3];
		else if (
			neighborString == '00011100' ||
			neighborString == '00001100' ||
			neighborString == '00011000'
		)
			return this.mapTextures[4];
		else if (
			neighborString == '00000111' ||
			neighborString == '00000011' ||
			neighborString == '00000110'
		)
			return this.mapTextures[5];
		else if (
			neighborString == '11000001' ||
			neighborString == '10000001' ||
			neighborString == '11000000'
		)
			return this.mapTextures[6];
		else if (
			neighborString == '01110000' ||
			neighborString == '00110000' ||
			neighborString == '01100000'
		)
			return this.mapTextures[7];
		else if (neighborString == '00000001') return this.mapTextures[8];
		else if (neighborString == '01000000') return this.mapTextures[9];
		else if (neighborString == '00010000') return this.mapTextures[10];
		else if (neighborString == '00000100') return this.mapTextures[11];

		return this.mapTextures[12];
	}

	draw() {
		this.context.fillStyle = 'rgb(14,112,209)';
		this.context.fillRect(0, 0, WindowWidth, WindowHeight);

		let verticalOffset = (WindowHeight - this.level.length * LevelCell) / 2;
		let horizontalOffset = (WindowWidth - this.level[0].length * LevelCell) / 2;

		this.context.fillStyle = this.color;
		this.context.fillRect(
			horizontalOffset,
			verticalOffset,
			WindowWidth - 2 * horizontalOffset,
			WindowHeight - 2 * verticalOffset
		);

		//drawing map
		for (let i = 0; i < this.level.length; i++) {
			for (let j = 0; j < this.level[i].length; j++) {
				if (this.level[i][j] == 0) {
					this.context.drawImage(
						this.getTexture(i, j),
						j * LevelCell + horizontalOffset,
						i * LevelCell + verticalOffset,
						LevelCell,
						LevelCell
					);
				}
			}
		}

		//drawing coins
		for (let i = 0; i < this.level.length; i++) {
			for (let j = 0; j < this.level[i].length; j++) {
				let x = j * LevelCell + horizontalOffset + LevelCell / 2;
				let y = i * LevelCell + verticalOffset + LevelCell / 2;
				if (this.coinMap[i][j] == 1) {
					context.fillStyle = 'yellow';
					context.beginPath();
					context.arc(x, y, LevelCell / 4, 0, 2 * Math.PI);
					context.fill();
				} else if (this.coinMap[i][j] == 2) {
					context.fillStyle = 'yellow';
					context.beginPath();
					context.arc(x, y, LevelCell / 2.5, 0, 2 * Math.PI);
					context.fill();
				}
			}
		}

		//drawing entities
		this.player.draw(verticalOffset, horizontalOffset);
		this.enemies.forEach(enemy => {
			enemy.draw(verticalOffset, horizontalOffset);
		});
	}

	input(key) {
		if (key == 16) {
			this.game.endLevel({
				success: true,
				levelNumber: this.levelNumber,
				timeElapsed: Math.floor(LevelTime - this.timer)
			});
		}
		this.player.input(key);
	}

	async loadMapTextures() {
		this.mapTextures = [];

		let texture = new Image();
		texture.src = '../img/map/corner1.png';
		this.mapTextures.push(texture);

		texture = new Image();
		texture.src = '../img/map/corner2.png';
		this.mapTextures.push(texture);

		texture = new Image();
		texture.src = '../img/map/corner3.png';
		this.mapTextures.push(texture);

		texture = new Image();
		texture.src = '../img/map/corner4.png';
		this.mapTextures.push(texture);

		texture = new Image();
		texture.src = '../img/map/half1.png';
		this.mapTextures.push(texture);

		texture = new Image();
		texture.src = '../img/map/half2.png';
		this.mapTextures.push(texture);

		texture = new Image();
		texture.src = '../img/map/half3.png';
		this.mapTextures.push(texture);

		texture = new Image();
		texture.src = '../img/map/half4.png';
		this.mapTextures.push(texture);

		texture = new Image();
		texture.src = '../img/map/innercorner1.png';
		this.mapTextures.push(texture);

		texture = new Image();
		texture.src = '../img/map/innercorner2.png';
		this.mapTextures.push(texture);

		texture = new Image();
		texture.src = '../img/map/innercorner3.png';
		this.mapTextures.push(texture);

		texture = new Image();
		texture.src = '../img/map/innercorner4.png';
		this.mapTextures.push(texture);

		texture = new Image();
		texture.src = '../img/map/whole.bmp';
		this.mapTextures.push(texture);
	}
}
