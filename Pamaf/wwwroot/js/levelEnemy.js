class LevelEnemy {
	constructor(x, y, speed, level, guiding, player, enemyType, difficulty, context) {
		this.x = x;
		this.y = y;
		this.speed = LevelCell / speed;
		this.level = level;
		this.guiding = guiding;
		this.player = player;
		this.context = context;
		this.direction = 0;
		this.nextDirection = 0;
		this.size = LevelCell;
		this.enemyType = enemyType;
		this.line = Math.floor(this.y / LevelCell);
		this.column = Math.floor(this.x / LevelCell);
		this.goSleep(60 * this.enemyType);
		this.cycleLimit = Math.floor(GameCycle * difficulty);
		this.cycleCount = 0;
		this.enemyCorner = getCorner(this.enemyType);
		this.randomChance = 1 - (0.7 + 0.3 * difficulty);

		// enemyMode:
		// 1  -  sleep
		// 2  -  hunted
		// 3  -  hunting
		// 4  -  scatter
	}

	input(key) {
		switch (key) {
			case 37:
				this.nextDirection = 4;
				break;
			case 38:
				this.nextDirection = 1;
				break;
			case 39:
				this.nextDirection = 2;
				break;
			case 40:
				this.nextDirection = 3;
				break;
			default:
				this.nextDirection = this.direction;
				break;
		}
	}

	positionCorrection() {
		let xRest = this.x % LevelCell;
		let yRest = this.y % LevelCell;

		if (xRest <= 0.1) {
			this.x -= xRest;
		} else if (xRest >= LevelCell - 0.1) {
			this.x += LevelCell - xRest;
		}

		if (yRest <= 0.1) {
			this.y -= yRest;
		} else if (yRest >= LevelCell - 0.1) {
			this.y += LevelCell - yRest;
		}
	}

	canChangeDirection(direction) {
		var column = Math.floor((this.x + LevelCell / 2) / LevelCell);
		var line = Math.floor((this.y + LevelCell / 2) / LevelCell);
		if (direction == 1) {
			if (this.x % LevelCell == 0 && this.level[line - 1][column] == 1) return true;
		} else if (direction == 3) {
			if (this.x % LevelCell == 0 && this.level[line + 1][column] == 1) return true;
		} else if (direction == 2) {
			if (this.y % LevelCell == 0 && this.level[line][column + 1] == 1) return true;
		} else {
			if (this.y % LevelCell == 0 && this.level[line][column - 1] == 1) return true;
		}
		return false;
	}

	getCrossroadOptions() {
		var result = [];
		let up = this.canChangeDirection(1);
		let right = this.canChangeDirection(2);
		let down = this.canChangeDirection(3);
		let left = this.canChangeDirection(4);

		if (up) result.push(1);
		if (right) result.push(2);
		if (down) result.push(3);
		if (left) result.push(4);

		if ((up || down) && (left || right)) return { directions: result, crossroad: true };
		return { directions: result, crossroad: false };
	}

	move() {
		var rest = 0;

		switch (this.direction) {
			case 1:
				rest = this.y % LevelCell;
				if (this.level[this.line - 1][this.column] == 1) {
					this.y -= this.speed;
				} else {
					if (rest > this.speed) {
						this.y -= this.speed;
					} else {
						this.y -= rest;
					}
				}
				break;
			case 3:
				rest = LevelCell - (this.y % LevelCell);
				if (this.level[this.line + 1][this.column] == 0) {
					return;
				}
				if (this.level[this.line + 1][this.column] == 1) {
					this.y += this.speed;
				} else {
					if (rest > this.speed) {
						this.y += this.speed;
					} else {
						this.y += rest;
					}
				}
				break;
			case 2:
				rest = LevelCell - (this.x % LevelCell);
				if (this.level[this.line][this.column + 1] == 0) {
					return;
				}
				if (this.level[this.line][this.column + 1] == 1) {
					this.x += this.speed;
				} else {
					if (rest > this.speed) {
						this.x += this.speed;
					} else {
						this.x += rest;
					}
				}
				break;
			case 4:
				rest = this.x % LevelCell;
				if (this.level[this.line][this.column - 1] == 1) {
					this.x -= this.speed;
				} else {
					if (rest > this.speed) {
						this.x -= this.speed;
					} else {
						this.x -= rest;
					}
				}
				break;
			default:
				break;
		}
	}

	randomChoice(options) {
		this.direction = options.directions[Math.floor(Math.random() * options.directions.length)];
	}

	goSleep(amount) {
		this.mode = 1;
		this.x = LevelCell * (9.75 + this.enemyType * 1.5);
		this.y = LevelCell * 14;
		this.sleepCounter = amount;
	}
	goWakeUp() {
		this.mode = 3;
		this.x = LevelCell * 12;
		this.y = LevelCell * 11;
	}

	goChased(amount) {
		if (this.mode != 1) {
			this.direction = this.direction > 2 ? this.direction - 2 : this.direction + 2;
			this.mode = 2;
			this.chasedCounter = amount;
		}
	}

	executeStrategy(enemyType, options) {
		if (Math.random() < this.randomChance || enemyType == 4) {
			let originDirection = this.direction > 2 ? this.direction - 2 : this.direction + 2;
			options.directions.splice(options.directions.indexOf(originDirection), 1);
			this.randomChoice(options);
		} else if (enemyType == 1) {
			let nextDirection = this.guiding[
				this.line + ':' + this.column + '-' + this.player.line + ':' + this.player.column
			];

			if (nextDirection == 0) {
				this.randomChoice(options);
			} else {
				if (this.canChangeDirection(nextDirection)) {
					this.direction = nextDirection;
				}
			}
		} else if (enemyType == 2) {
			let nextPosition = getAheadPosition(
				this.level,
				this.player.line,
				this.player.column,
				this.player.direction
			);
			let nextDirection = this.guiding[
				this.line + ':' + this.column + '-' + nextPosition.line + ':' + nextPosition.column
			];
			if (nextDirection == 0) {
				this.randomChoice(options);
			} else {
				if (this.canChangeDirection(nextDirection)) {
					this.direction = nextDirection;
				}
			}
		} else if (enemyType == 3) {
			let nextDirection = 0;
			if (this.retreating) {
				nextDirection = this.guiding[
					this.line +
						':' +
						this.column +
						'-' +
						this.enemyCorner.line +
						':' +
						this.enemyCorner.column
				];
				if (nextDirection == 0) this.retreating = false;
			} else {
				let distance = Math.sqrt(
					Math.pow(this.line - this.player.line, 2) + Math.pow(this.column - this.player.column, 2)
				);
				if (distance > 8) {
					nextDirection = this.guiding[
						this.line + ':' + this.column + '-' + this.player.line + ':' + this.player.column
					];
				} else {
					this.retreating = true;
				}
			}
			if (nextDirection != 0) {
				if (this.canChangeDirection(nextDirection)) {
					this.direction = nextDirection;
				}
			}
		}
	}

	draw(verticalOffset, horizontalOffset) {
		this.context.fillStyle = 'purple';
		this.context.fillRect(
			this.x + horizontalOffset + (LevelCell - this.size) / 2,
			this.y + verticalOffset + (LevelCell - this.size) / 2,
			this.size,
			this.size
		);
	}
	update() {
		this.cycleCount = (this.cycleCount + 1) % GameCycle;
		this.positionCorrection();
		this.line = Math.floor(this.y / LevelCell);
		this.column = Math.floor(this.x / LevelCell);

		if (this.mode == 1) {
			this.sleepCounter--;
			if (!this.sleepCounter) this.goWakeUp();
		} else if (this.mode == 2) {
			this.chasedCounter--;
			let options = this.getCrossroadOptions();
			if (!this.chasedCounter) {
				this.mode = 3;
			}
			if (options.crossroad) {
				let originDirection = this.direction > 2 ? this.direction - 2 : this.direction + 2;
				options.directions.splice(options.directions.indexOf(originDirection), 1);
				this.randomChoice(options);
			}
			this.move();
		} else {
			this.mode = this.cycleCount < this.cycleLimit ? 3 : 4;
			if (this.mode == 3) {
				let options = this.getCrossroadOptions();
				if (options.crossroad || this.direction == 0) {
					this.executeStrategy(this.enemyType, options);
				}
				this.move();
				this.scatterComplete = false;
			} else if (this.mode == 4) {
				if (this.x % LevelCell == 0 && this.y % LevelCell == 0) {
					if (this.scatterComplete) {
						let options = this.getCrossroadOptions();
						if (!!this.direction) {
							let originDirection = this.direction > 2 ? this.direction - 2 : this.direction + 2;
							options.directions.splice(options.directions.indexOf(originDirection), 1);
						}
						this.randomChoice(options);
					} else {
						let nextDirection = this.guiding[
							this.line +
								':' +
								this.column +
								'-' +
								this.enemyCorner.line +
								':' +
								this.enemyCorner.column
						];
						if (nextDirection != 0) {
							if (this.canChangeDirection(nextDirection)) {
								this.direction = nextDirection;
							}
						} else {
							this.scatterComplete = true;
						}
					}
				}
				this.move();
			}
		}
	}
}
