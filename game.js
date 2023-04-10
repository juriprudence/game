// create the game canvas and set its dimensions
// get the game canvas and context
const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

// set up the game objects
let playerX = 375;
const playerWidth = 50;
const playerHeight = 50;

const fallingObjects = [];
let score = 0;

function addFallingObject() {
	const objectX = Math.random() * 750;
	fallingObjects.push({
		x: objectX,
		y: -25,
		width: 25,
		height: 25
	});
}

setInterval(addFallingObject, 1000);

// set up the keyboard input
const keyboard = new Keyboard();
keyboard.addKey(37); // left arrow
keyboard.addKey(39); // right arrow

// set up the game loop
let previousTimestamp = 0;

function gameLoop(timestamp) {
	const deltaTime = timestamp - previousTimestamp;
	previousTimestamp = timestamp;

	update(deltaTime);
	render();

	window.requestAnimationFrame(gameLoop);
}
window.requestAnimationFrame(gameLoop);

// update the game state
function update(deltaTime) {
	// update the player's position
	if (keyboard.isKeyDown(37)) { // left arrow
		playerX -= 5;
	}
	if (keyboard.isKeyDown(39)) { // right arrow
		playerX += 5;
	}

	// update the falling objects' positions
	for (let i = 0; i < fallingObjects.length; i++) {
		const object = fallingObjects[i];
		object.y += 5;
		if (object.y > 600) {
			fallingObjects.splice(i, 1);
			i--;
		} else if (object.x < playerX + playerWidth &&
				   object.x + object.width > playerX &&
				   object.y < 550 + playerHeight &&
				   object.y + object.height > 550) {
			fallingObjects.splice(i, 1);
			i--;
			score++;
		}
	}
}

// render the game scene
function render() {
	// clear the canvas
	context.clearRect(0, 0, canvas.width, canvas.height);

	// draw the player
	context.fillStyle = "red";
	context.fillRect(playerX, 550, playerWidth, playerHeight);

	// draw the falling objects
	context.fillStyle = "green";
	for (const object of fallingObjects) {
		context.fillRect(object.x, object.y, object.width, object.height);
	}

	// draw the score
	context.fillStyle = "black";
	context.font = "24px Arial";
	context.fillText("Score: " + score, 10, 30);
}

// keyboard input handler
function Keyboard() {
	const self = this;
	this.keys = {};

	window.addEventListener("keydown", function(event) {
		self.keys[event.keyCode] = true;
	});

	window.addEventListener("keyup", function(event) {
		delete self.keys[event.keyCode];
	});

	this.isKeyDown = function(keyCode) {
		return self.keys[keyCode] ? true : false;
	};

	this.addKey = function(keyCode) {
		self.keys[keyCode] = false;
	};
}
