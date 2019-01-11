class Player {
	constructor(width, height, context) {
		this.x = WindowWidth / 2 - width / 2;
		this.y = WindowHeight / 2 - height / 2;
		this.width = width;
		this.height = height;
		this.context = context;
		this.hearts = 3;
		this.score = 0;
	}

	draw() {
		this.context.fillStyle = 'black';
		this.context.fillRect(
			WindowWidth / 2 - this.width / 2,
			WindowHeight / 2 - this.height / 2,
			this.width,
			this.height
		);
	}

	updateX(x) {
		this.x = WindowWidth / 2 - this.width / 2 + x;
	}

	updateY(y) {
		this.y = WindowHeight / 2 - this.height / 2 + y;
	}
}
