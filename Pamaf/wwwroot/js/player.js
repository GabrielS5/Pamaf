class Player {
	constructor(context) {
		this.x = WindowWidth / 2 - PlayerSize / 2;
		this.y = WindowHeight / 2 - PlayerSize / 2;
		this.width = PlayerSize;
		this.height = PlayerSize;
		this.context = context;
		this.image = new Image();
		if (localStorage.getItem('isAuthenticated') === 'true')
			this.image.src = localStorage.getItem('picture');
		else this.image.src = '../img/boy.bmp';
	}

	draw() {
		this.context.fillStyle = 'black';
		this.context.drawImage(
			this.image,
			WindowWidth / 2 - this.width / 2,
			WindowHeight / 2 - this.height / 2,
			this.width,
			this.height
		);
		this.context.strokeStyle = 'black';
		this.context.lineWidth = 3;
		this.context.strokeRect(
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
