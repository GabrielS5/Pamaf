class LevelPlayer {
	constructor(x, y, speed, level, hearts, score, context) {
		this.x = x;
		this.y = y;
		this.speed = LevelCell / speed;
		console.log(this.speed);
		this.level = level;
		this.context = context;
		this.direction = 0;
		this.nextDirection = 0;
		this.size = LevelCell - 10;
		this.line = Math.floor(this.y / LevelCell);
		this.column = Math.floor(this.x / LevelCell);
		this.hearts = hearts;
		this.score = score;
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
		this.positionCorrection();
		this.line = Math.floor(this.y / LevelCell);
		this.column = Math.floor(this.x / LevelCell);

		if (this.nextDirection != this.direction) {
			if (this.canChangeDirection(this.nextDirection)) {
				this.direction = this.nextDirection;
			}
		}
		this.move();
	}
}
