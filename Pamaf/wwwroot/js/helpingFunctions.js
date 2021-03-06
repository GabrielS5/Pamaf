function cloneMatrix(matrix) {
	var newMatrix = [];

	for (var i = 0; i < matrix.length; i++) newMatrix[i] = matrix[i].slice();

	return newMatrix;
}

function completeMaze(maze, i, j, cost) {
	if (maze[i][j] == 0 || (maze[i][j] < cost && maze[i][j] != 1)) return;
	maze[i][j] = cost;

	completeMaze(maze, i - 1, j, cost + 1);
	completeMaze(maze, i + 1, j, cost + 1);
	completeMaze(maze, i, j - 1, cost + 1);
	completeMaze(maze, i, j + 1, cost + 1);
}

function getGuidingPath(maze, originX, originY, currentX, currentY, direction, lastCost, guiding) {
	if (maze[currentX][currentY] == 0 || maze[currentX][currentY] != lastCost + 1) return;

	guiding[originX + ':' + originY + '-' + currentX + ':' + currentY] = direction;

	getGuidingPath(maze, originX, originY, currentX + 1, currentY, direction, lastCost + 1, guiding);
	getGuidingPath(maze, originX, originY, currentX, currentY + 1, direction, lastCost + 1, guiding);
	getGuidingPath(maze, originX, originY, currentX - 1, currentY, direction, lastCost + 1, guiding);
	getGuidingPath(maze, originX, originY, currentX, currentY - 1, direction, lastCost + 1, guiding);
}

function getGuiding(maze) {
	var guiding = [];

	for (let i = 0; i < maze.length; i++) {
		for (let j = 0; j < maze[i].length; j++) {
			if (
				maze[i][j] != 0
				//(maze[i - 1][j] == 1 || maze[i + 1][j] == 1) &&
				//(maze[i][j - 1] == 1 || maze[i][j + 1])
			) {
				var clone = cloneMatrix(maze);
				completeMaze(clone, i, j, 2);

				guiding[i + ':' + j + '-' + i + ':' + j] = 0;

				getGuidingPath(clone, i, j, i - 1, j, 1, 2, guiding);
				getGuidingPath(clone, i, j, i, j + 1, 2, 2, guiding);
				getGuidingPath(clone, i, j, i + 1, j, 3, 2, guiding);
				getGuidingPath(clone, i, j, i, j - 1, 4, 2, guiding);
			}
		}
	}
	return guiding;
}

function getCorner(type) {
	if (type == 1) return { line: 1, column: 1 };
	if (type == 2) return { line: 1, column: 26 };
	if (type == 3) return { line: 29, column: 1 };
	if (type == 4) return { line: 29, column: 26 };
}

function getAheadPosition(level, line, column, direction) {
	let lineInc = direction == 1 ? -1 : direction == 3 ? 1 : 0;
	let columnInc = direction == 2 ? 1 : direction == 4 ? -1 : 0;
	let count = 0;
	while (level[line + lineInc][column + columnInc] == 1 && count++ < 4) {
		line += lineInc;
		column += columnInc;
	}

	return { line: line, column: column };
}

function getCoinMap(level) {
	let coinMap = cloneMatrix(level);

	for (let i = 0; i < level.length; i++) {
		for (let j = 0; j < level[i].length; j++) {
			if (i >= 11 && i <= 17 && j >= 9 && j <= 18) {
				coinMap[i][j] = 0;
			}
		}
	}

	do {
		let randomLine = Math.floor(Math.random() * 15);
		let randomColumn = Math.floor(Math.random() * 14);
		if (coinMap[randomLine][randomColumn] == 1) {
			coinMap[randomLine][randomColumn] = 2;
			break;
		}
	} while (true);

	do {
		let randomLine = Math.floor(Math.random() * 15);
		let randomColumn = Math.floor(14 + Math.random() * 14);
		if (coinMap[randomLine][randomColumn] == 1) {
			coinMap[randomLine][randomColumn] = 2;
			break;
		}
	} while (true);

	do {
		let randomLine = Math.floor(16 + Math.random() * 15);
		let randomColumn = Math.floor(Math.random() * 14);
		if (coinMap[randomLine][randomColumn] == 1) {
			coinMap[randomLine][randomColumn] = 2;
			break;
		}
	} while (true);

	do {
		let randomLine = Math.floor(16 + Math.random() * 15);
		let randomColumn = Math.floor(14 + Math.random() * 14);
		if (coinMap[randomLine][randomColumn] == 1) {
			coinMap[randomLine][randomColumn] = 2;
			break;
		}
	} while (true);

	return coinMap;
}

function checkCollision(player, structures) {
	for (let i = 0; i < structures.length; i++) {
		if (
			!(
				player.x > structures[i].x + structures[i].width ||
				player.x + player.width < structures[i].x ||
				player.y > structures[i].y + structures[i].height ||
				player.y + player.height < structures[i].y
			)
		)
			return i;
	}
	return -1;
}

function checkPointCollision(point, structures) {
	for (let i = 0; i < structures.length; i++) {
		if (
			point.x >= structures[i].x &&
			point.x <= structures[i].x + structures[i].width &&
			point.y >= structures[i].y &&
			point.y <= structures[i].y + structures[i].height
		)
			return i;
	}
	return -1;
}

function levelIsComplete(level, completedLevels) {
	return completedLevels.some(function(element) {
		return element.levelNumber == level.number;
	});
}

function getBotImages(friends, year) {
	var images = friends.slice();
	if (year == 1) images = images.concat(FirstYearTeachers.slice());
	else if (year == 2) images = images.concat(SecondYearTeachers.slice());
	else images = images.concat(ThirdYearTeachers.slice());
	var result = [];
	
	for (let i = 0; i < 4; i++) {
		let randNumber = Math.floor(Math.random() * images.length);
		result.push(images[randNumber]);
		images.splice(randNumber, randNumber);
	}

	return result;
}
