class Player {
	constructor(x, y, width, height, gameMap, context) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.context = context;
		this.gameMap = gameMap;
		this.movingLeft = false;
		this.movingRight = false;
		this.movingUp = false;
		this.movingDown = false;
		this.horizontalSpeed = 0;
		this.verticalSpeed = 0;
	}

	draw() {
		this.context.fillStyle = 'black';
		this.context.fillRect(this.x, this.y, this.width, this.height);
	}

	update() {
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
		let horizontalCollision = checkCollision(this, this.gameMap.walls);
		if (horizontalCollision != -1) {
			if (this.gameMap.walls[horizontalCollision].x < this.x)
				this.x +=
					this.gameMap.walls[horizontalCollision].x +
					this.gameMap.walls[horizontalCollision].width -
					this.x +
					0.1;
			else this.x -= this.x + this.width - this.gameMap.walls[horizontalCollision].x + 0.1;
		}

		this.y += this.verticalSpeed;
		let verticalCollision = checkCollision(this, this.gameMap.walls);
		if (verticalCollision != -1) {
			if (this.gameMap.walls[verticalCollision].y < this.y)
				this.y +=
					this.gameMap.walls[verticalCollision].y +
					this.gameMap.walls[verticalCollision].height -
					this.y +
					0.1;
			else this.y -= this.y + this.height - this.gameMap.walls[verticalCollision].y + 0.1;
		}

		if (this.horizontalSpeed >= -1 && this.horizontalSpeed <= 1) {
			this.horizontalSpeed = 0;
		} else this.horizontalSpeed -= this.horizontalSpeed / 5;

		if (this.verticalSpeed >= -1 && this.verticalSpeed <= 1) {
			this.verticalSpeed = 0;
		} else this.verticalSpeed -= this.verticalSpeed / 5;
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

	input(code) {
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
