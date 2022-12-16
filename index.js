
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var direction = '';
var directionQueue = '';
var snake = [];
var snakeLength = 10;
var cellSize = 5;

var pointX = [];
var pointY = [];
var point = {
	x: 0, 
	y: 0
};

var isDead = false;

var score = 0;

// pushes possible x and y positions to seperate arrays
for(i = 0; i <= canvas.width - cellSize; i+=cellSize) {
	pointX.push(i);
	pointY.push(i);
}

// draws a square.. obviously
function drawSquare(x,y,color) {
    ctx.beginPath();
	ctx.fillStyle = color;
	ctx.fillRect(x, y, cellSize, cellSize);	
    ctx.closePath();
}
// giving the point object its coordinates
function createpoint() { 
	point.x = pointX[Math.floor(Math.random()*pointX.length)]; // random x position from array
	point.y = pointY[Math.floor(Math.random()*pointY.length)]; // random y position from array
	// looping through the snake and checking if there is a collision
	for(i = 0; i < snake.length; i++) {
		if(checkCollision(point.x, point.y, snake[i].x, snake[i].y)) {
			createpoint(); 
		}
	}
}

// drawing point on the canvas
function drawpoint() {
	drawSquare(point.x, point.y, 'green');
}

// creating the snake and pushing coordinates to the array
function createSnake() {
	snake = [];
		for(var i = snakeLength; i > 0; i--) {
		k = i * cellSize;
		snake.push({x: k, y:0});
	}
}

// loops through the snake array and draws each element
function drawSnake() {
	for(i = 0; i < snake.length; i++) {
		drawSquare(snake[i].x, snake[i].y, 'green');
	}
}

function moveSnake() {
	var x = snake[0].x;
	var y = snake[0].y;

	direction = directionQueue;

	if(direction == 'right') {
		x+=cellSize;
	}
	else if(direction == 'left') {
		x-=cellSize;
	}
	else if(direction == 'up') {
		y-=cellSize;
	}
	else if(direction == 'down') {
		y+=cellSize;
	}
	// removes the tail and makes it the new head...very delicate, don't touch this
	var tail = snake.pop(); 
	tail.x = x;
	tail.y = y;
	snake.unshift(tail);
}
// checks if too coordinates match up
function checkCollision(x1,y1,x2,y2) {
	if(x1 == x2 && y1 == y2) {
		return true;
	}
	else {
		return false;
	}
}
// main game loop
function game(){
	var head = snake[0];
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.beginPath();
    ctx.font = "20px 'Pixeloid'";
    ctx.fillStyle = 'green';
    ctx.textAlign = 'right';
    const scoreS = String("Score: "+score);
    ctx.fillText(scoreS, canvas.width-scoreS.length, 20);
    ctx.closePath();

	if(head.x < 0 || head.x > canvas.width - cellSize  || head.y < 0 || head.y > canvas.height - cellSize) {
        isDead = true;
	}

	for(i = 1; i < snake.length; i++) {
		if(head.x == snake[i].x && head.y == snake[i].y) {
            isDead = true;
		}
	}

	if(checkCollision(head.x, head.y, point.x, point.y)) {
		snake[snake.length] = {x: head.x, y: head.y};
		createpoint();
		drawpoint();
		score++;
	}

    drawSnake();
    drawpoint();

    if (isDead) {
        ctx.beginPath();
        ctx.font = "40px 'Pixeloid'";
        ctx.fillStyle = 'green';
        ctx.textAlign = 'center';
        ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2);
        ctx.closePath();
    } else {
        moveSnake();
    }

    requestAnimationFrame(game);
}

function keyHandler(evt) {
    evt = evt || window.event;
    if((evt.key == 'ArrowRight' || evt.key == 'Right' || evt.key == 'KeyD' || evt.key == 'd') && direction != 'right') { 
        directionQueue = 'right';
    } else if((evt.key == 'ArrowDown' || evt.key == 'Down' || evt.key == 'KeyS' || evt.key == 's')  && direction != 'down') { 
        directionQueue = 'down';
    } else if((evt.key == 'ArrowLeft' || evt.key == 'Left' || evt.key == 'KeyA' || evt.key == 'a') && direction != 'left') {
        directionQueue = 'left';
    } else if((evt.key == 'ArrowUp' || evt.key == 'Up' || evt.key == 'KeyW' || evt.key == 'w') && direction != 'top') {
        directionQueue = 'up';
    }
};
document.addEventListener('keydown', keyHandler, false)


function newGame() {
	direction = 'right'; // initial direction
	directionQueue = 'right';
	ctx.beginPath();
	createSnake();
	createpoint();

	game();

}
newGame();