class LevelRunner {
	constructor(game, context) {
		this.game = game;
		this.context = context;
		this.level = null;
		this.player = null;
		this.enemies = [];
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

	draw() {
		this.context.fillStyle = 'cyan';
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
}
