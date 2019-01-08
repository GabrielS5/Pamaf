class LevelRunner {
	constructor(game, context) {
		this.game = game;
		this.context = context;
		this.level = null;
		this.player = null;
		this.enemies = [];
	}

	async init() {
		await this.loadMapTextures(this);
	}

	run(level, difficulty, levelNumber) {
		this.difficulty = difficulty;
		this.levelNumber = levelNumber;
		this.level = level;
		let guiding = getGuiding(level);
		this.coinMap = getCoinMap(level);
		this.player = new LevelPlayer(30, 30, 3, this.level, 3, 0, this.context);
		this.enemies = [];
		this.enemies.push(
			new LevelEnemy(30, 30, 7, this.level, guiding, this.player, 1, this.difficulty, this.context)
		);
		this.enemies.push(
			new LevelEnemy(30, 30, 7, this.level, guiding, this.player, 2, this.difficulty, this.context)
		);
		this.enemies.push(
			new LevelEnemy(30, 30, 7, this.level, guiding, this.player, 3, this.difficulty, this.context)
		);
		this.enemies.push(
			new LevelEnemy(30, 30, 7, this.level, guiding, this.player, 4, this.difficulty, this.context)
		);
	}

	resetLevel() {
		this.player.x = LevelCell;
		this.player.y = LevelCell;
		let guiding = getGuiding(this.level);
		this.enemies = [];
		this.enemies.push(
			new LevelEnemy(30, 30, 7, this.level, guiding, this.player, 1, this.difficulty, this.context)
		);
		this.enemies.push(
			new LevelEnemy(30, 30, 7, this.level, guiding, this.player, 2, this.difficulty, this.context)
		);
		this.enemies.push(
			new LevelEnemy(30, 30, 7, this.level, guiding, this.player, 3, this.difficulty, this.context)
		);
		this.enemies.push(
			new LevelEnemy(30, 30, 7, this.level, guiding, this.player, 4, this.difficulty, this.context)
		);
	}

	checkEndGame() {
		if (this.player.hearts < 0) {
			this.game.endLevel({
				success: true,
				score: this.player.score
			});
		} else {
			if (this.coinMap.filter(f => f.some(s => s != 0)).length == 0) {
				this.game.endLevel({
					success: true,
					hearts: this.player.hearts,
					score: this.player.score
				});
			}
		}
	}

	update() {
		let pAverageLine = Math.floor((this.player.y + LevelCell / 2) / LevelCell);
		let pAverageColumn = Math.floor((this.player.x + LevelCell / 2) / LevelCell);

		// coins collisions
		if (this.coinMap[pAverageLine][pAverageColumn] == 1) {
			this.player.score += 10;
			this.coinMap[pAverageLine][pAverageColumn] = 0;
		} else if (this.coinMap[pAverageLine][pAverageColumn] == 2) {
			this.player.score += 100;
			this.coinMap[pAverageLine][pAverageColumn] = 0;
			this.enemies.forEach(enemy => {
				enemy.goChased(Math.floor(300 - 100 * this.difficulty));
			});
		}

		// entity collisions
		this.enemies.forEach(enemy => {
			let eAverageLine = Math.floor((enemy.y + LevelCell / 2) / LevelCell);
			let eAverageColumn = Math.floor((enemy.x + LevelCell / 2) / LevelCell);
			if (pAverageLine == eAverageLine && pAverageColumn == eAverageColumn) {
				if (enemy.mode == 2) {
					enemy.goSleep(Math.floor(200 - 100 * this.difficulty));
					this.player.score += 200;
				} else {
					this.player.hearts--;
					this.resetLevel();
				}
			}
		});

		this.player.update();

		this.enemies.forEach(enemy => {
			enemy.update();
		});

		this.checkEndGame();
	}

	getTexture(line, column) {
		if (
			line == 0 ||
			line == this.level.length - 1 ||
			column == 0 ||
			column == this.level[0].length - 1
		)
			return this.mapTextures[12];
		let neighborString = '';
		neighborString += this.level[line][column + 1];
		neighborString += this.level[line + 1][column + 1];
		neighborString += this.level[line + 1][column];
		neighborString += this.level[line + 1][column - 1];
		neighborString += this.level[line][column - 1];
		neighborString += this.level[line - 1][column - 1];
		neighborString += this.level[line - 1][column];
		neighborString += this.level[line - 1][column + 1];

		if (neighborString == '01111100') return this.mapTextures[0];
		else if (neighborString == '00011111') return this.mapTextures[1];
		else if (neighborString == '11000111') return this.mapTextures[2];
		else if (neighborString == '11110001') return this.mapTextures[3];
		else if (neighborString == '00011100' || neighborString == '00001100' || neighborString == '00011000') return this.mapTextures[4];
		else if (neighborString == '00000111' || neighborString == '00000011' || neighborString == '00000110') return this.mapTextures[5];
		else if (neighborString == '11000001' || neighborString == '10000001' || neighborString == '11000000') return this.mapTextures[6];
		else if (neighborString == '01110000' || neighborString == '00110000' || neighborString == '01100000') return this.mapTextures[7];
		else if (neighborString == '00000001') return this.mapTextures[8];
		else if (neighborString == '01000000') return this.mapTextures[9];
		else if (neighborString == '00010000') return this.mapTextures[10];
		else if (neighborString == '00000100') return this.mapTextures[11];

		return this.mapTextures[12];
	}

	draw() {
		this.context.fillStyle = 'white';
		this.context.fillRect(0, 0, WindowWidth, WindowHeight);

		let verticalOffset = (WindowHeight - this.level.length * LevelCell) / 2;
		let horizontalOffset = (WindowWidth - this.level[0].length * LevelCell) / 2;

		//drawing map
		for (let i = 0; i < this.level.length; i++) {
			for (let j = 0; j < this.level[i].length; j++) {
				if (this.level[i][j] == 0) {
					this.context.fillStyle = 'black';
					this.context.fillRect(
						j * LevelCell + horizontalOffset,
						i * LevelCell + verticalOffset,
						LevelCell,
						LevelCell
					);
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
		this.player.input(key);
	}

	async loadMapTextures() {
		this.mapTextures = [];

		let texture = new Image();
		texture.src = '../img/map/corner1.bmp';
		this.mapTextures.push(texture);

		texture = new Image();
		texture.src = '../img/map/corner2.bmp';
		this.mapTextures.push(texture);

		texture = new Image();
		texture.src = '../img/map/corner3.bmp';
		this.mapTextures.push(texture);

		texture = new Image();
		texture.src = '../img/map/corner4.bmp';
		this.mapTextures.push(texture);

		texture = new Image();
		texture.src = '../img/map/half1.bmp';
		this.mapTextures.push(texture);

		texture = new Image();
		texture.src = '../img/map/half2.bmp';
		this.mapTextures.push(texture);

		texture = new Image();
		texture.src = '../img/map/half3.bmp';
		this.mapTextures.push(texture);

		texture = new Image();
		texture.src = '../img/map/half4.bmp';
		this.mapTextures.push(texture);

		texture = new Image();
		texture.src = '../img/map/innercorner1.bmp';
		this.mapTextures.push(texture);

		texture = new Image();
		texture.src = '../img/map/innercorner2.bmp';
		this.mapTextures.push(texture);

		texture = new Image();
		texture.src = '../img/map/innercorner3.bmp';
		this.mapTextures.push(texture);

		texture = new Image();
		texture.src = '../img/map/innercorner4.bmp';
		this.mapTextures.push(texture);

		texture = new Image();
		texture.src = '../img/map/whole.bmp';
		this.mapTextures.push(texture);
	}
}
