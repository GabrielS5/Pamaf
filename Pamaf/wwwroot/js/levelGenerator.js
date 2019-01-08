class LevelGenerator {
	constructor() {
		this.topLevelParts = [];
		this.middleLevelParts = [];
		this.bottomLevelParts = [];
	}

	async init() {
		await this.loadTopParts(this);
		await this.loadMiddleParts(this);
		await this.loadBottomParts(this);
	}

	getRandomLevel() {
		let topPart = cloneMatrix(
			this.topLevelParts[Math.floor(Math.random() * this.topLevelParts.length)].blocks
		);
		let middlePart = cloneMatrix(
			this.middleLevelParts[Math.floor(Math.random() * this.middleLevelParts.length)].blocks
		);
		let bottomPart = cloneMatrix(
			this.bottomLevelParts[Math.floor(Math.random() * this.bottomLevelParts.length)].blocks
		);

		let level = [];

		for (let i = 0; i < topPart.length; i++) {
			var row = [];
			for (let j = 0; j < topPart[i].length; j++) {
				row.push(topPart[i][j]);
			}
			topPart[i].reverse();
			for (let j = 0; j < topPart[i].length; j++) {
				row.push(topPart[i][j]);
			}
			level.push(row);
		}

		for (let i = 0; i < middlePart.length; i++) {
			var row = [];
			for (let j = 0; j < middlePart[i].length; j++) {
				row.push(middlePart[i][j]);
			}
			middlePart[i].reverse();
			for (let j = 0; j < middlePart[i].length; j++) {
				row.push(middlePart[i][j]);
			}
			level.push(row);
		}

		for (let i = 0; i < bottomPart.length; i++) {
			var row = [];
			for (let j = 0; j < bottomPart[i].length; j++) {
				row.push(bottomPart[i][j]);
			}
			bottomPart[i].reverse();
			for (let j = 0; j < bottomPart[i].length; j++) {
				row.push(bottomPart[i][j]);
			}
			level.push(row);
		}

		return level;
	}

	async loadTopParts(levelGenerator) {
		var xobj = new XMLHttpRequest();
		xobj.overrideMimeType('application/json');
		xobj.open('GET', '../json/topLevelParts.json', false);
		xobj.send(null);
		if (xobj.status == '200') {
			levelGenerator.topLevelParts = JSON.parse(xobj.responseText);
		}
	}

	async loadMiddleParts(levelGenerator) {
		var xobj = new XMLHttpRequest();
		xobj.overrideMimeType('application/json');
		xobj.open('GET', '../json/middleLevelParts.json', false);
		xobj.send(null);
		if (xobj.status == '200') {
			levelGenerator.middleLevelParts = JSON.parse(xobj.responseText);
		}
	}

	async loadBottomParts(levelGenerator) {
		var xobj = new XMLHttpRequest();
		xobj.overrideMimeType('application/json');
		xobj.open('GET', '../json/bottomLevelParts.json', false);
		xobj.send(null);
		if (xobj.status == '200') {
			levelGenerator.bottomLevelParts = JSON.parse(xobj.responseText);
		}
	}
}
