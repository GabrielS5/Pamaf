class Player {
	constructor(context) {
		this.x = WindowWidth / 2 - PlayerSize / 2;
		this.y = WindowHeight / 2 - PlayerSize / 2;
		this.width = PlayerSize;
		this.height = PlayerSize;
		this.context = context;
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
