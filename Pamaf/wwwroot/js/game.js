class Game {
	constructor(canvas, context, levelGenerator) {
		this.canvas = canvas;
		this.context = context;
		this.isReady = false;
		this.gameMap = null;
		this.levelGenerator = levelGenerator;
		this.levelRunner = new LevelRunner(this, context);
		this.levelRunning = false;
	}

	changeMap(map) {
		this.currentMap = map;
		this.player = new Player(
			this.gameMap[this.currentMap].playerStart.x,
			this.gameMap[this.currentMap].playerStart.y,
			50,
			50,
			this.gameMap[this.currentMap],
			this.context
		);
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
				this.context.fillRect(element.x, element.y, element.width, element.height);
			});

			this.gameMap[this.currentMap].levels.forEach(element => {
				this.context.fillStyle = 'yellow';
				this.context.fillRect(element.x, element.y, element.width, element.height);
			});

			this.player.draw();
		}
		this.context.fillStyle = 'rgb(10,80,150)';
		this.context.fillRect(0, WindowHeight, this.canvas.width, BottomMenuHeight);

		let bottomMenuStart = BottomMenuHeight / 4;
		let bottomMenuInfoSize = BottomMenuHeight / 2;

		for (let i = 0; i < this.player.hearts; i++) {
			this.context.drawImage(
				this.textures[0],
				25 + (25 + bottomMenuInfoSize) * i,
				bottomMenuStart + WindowHeight,
				bottomMenuInfoSize,
				bottomMenuInfoSize
			);
		}

		this.context.fillStyle = 'yellow';
		this.context.font = bottomMenuInfoSize + 'px Arcade Classic';
		this.context.fillText(
			'Hello World',
			(2 * WindowWidth) / 3,
			bottomMenuStart + WindowHeight + bottomMenuInfoSize
		
		);
	}

	update() {
		if (this.levelRunning) {
			this.levelRunner.update();
		} else {
			this.player.update();
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
				this.player.input(key);
			}
		}
	}

	async loadTextures() {
		this.textures = [];

		let texture = new Image();
		texture.src = '../img/heart.png';
		this.textures.push(texture);
	}
}
