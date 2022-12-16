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

var FPS = 0;
var frameCount = 0;


for(i = 0; i <= canvas.width - cellSize; i+=cellSize) {
	pointX.push(i);
	pointY.push(i);
}

function drawSquare(x,y,color) {
    ctx.beginPath();
	ctx.fillStyle = color;
	ctx.fillRect(x, y, cellSize, cellSize);	
    ctx.closePath();
}

function createpoint() { 
	point.x = pointX[Math.floor(Math.random()*pointX.length)];
	point.y = pointY[Math.floor(Math.random()*pointY.length)];
	for(i = 0; i < snake.length; i++) {
		if(checkCollision(point.x, point.y, snake[i].x, snake[i].y)) {
			createpoint(); 
		}
	}
}

function makePoint() {
	drawSquare(point.x, point.y, 'green');
}

function createSnake() {
	snake = [];
		for(var i = snakeLength; i > 0; i--) {
		k = i * cellSize;
		snake.push({x: k, y:0});
	}
}

function makeSnake() {
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

	var tail = snake.pop(); 
	tail.x = x;
	tail.y = y;
	snake.unshift(tail);
}
p
function checkCollision(x1,y1,x2,y2) {
	if(x1 == x2 && y1 == y2) {
		return true;
	}
	else {
		return false;
	}
}

function countFPS() {
    FPS = frameCount;
    frameCount = 0;
}

var FMOD = {}; 
FMOD['TOTAL_MEMORY'] = 24 * 1024 * 1024;
FMOD['preRun'] = FMODpreRun;
FMOD['onRuntimeInitialized'] = FMODMMain;
FMODModule(FMOD); 

function FMODpreRun() {
	console.log('FMOD preRun. Mounting files...');
	//FMOD.FS_createPreloadedFile('/', 'Master.bank', './assets/sound/FMOD/Build/Desktop/Master.bank', true, false);
	//FMOD.FS_createPreloadedFile('/', 'Master.strings.bank', './assets/sound/FMOD/Build/Desktop/Master.strings.bank', true, false);
    //FMOD.FS_createPreloadedFile('/', 'SFX.bank', './assets/sound/FMOD/Build/Desktop/SFX.bank', true, false);
}

function CHECK_RESULT(result)
{
    if (result != FMOD.OK)
    {
        var msg = "Error!!! '" + FMOD.ErrorString(result) + "'";

        alert(msg);

        throw msg;
    }
}

function FMODMMain() {
    /*let outval = {};
    var system;
    result = FMOD.Studio_System_Create(outval);
    CHECK_RESULT(result);

    system = outval.val;

    system.setDSPBufferSize(2048, 2);
	system.initialize(128, FMOD.STUDIO_INITFLAGS.NORMAL, null);

	system.loadBankFile('Master.bank', FMOD.STUDIO_LOAD_BANK_FLAGS.NORMAL, outval);
	system.loadBankFile('Master.strings.bank', FMOD.STUDIO_LOAD_BANK_FLAGS.NORMAL, outval);
    system.loadBankFile('SFX.bank', FMOD.STUDIO_LOAD_BANK_FLAGS.NORMAL, outval);

	system.getEvent('event:/boop', outval);
	let desc = outval.val;
	desc.createInstance(outval);
	let inst = outval.val;
	inst.start();

    function playSound(sound) {
        system.getEvent(sound, outval);
        let desc = outval.val;
        desc.createInstance(outval);
        let inst = outval.val;
        inst.start();
    }
    
    setInterval(() => {
		system.update()
	}, 1000/60)*/

    function drawLoop(){
        var head = snake[0];
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        ctx.beginPath();
        ctx.font = "20px 'Pixeloid'";
        ctx.fillStyle = 'green';
        ctx.textAlign = 'right';
        var scoreS = String("Score: "+score);
        ctx.fillText(scoreS, canvas.width-scoreS.length, 20);
        ctx.closePath();

        ctx.beginPath();
        ctx.font = "20px 'Pixeloid'";
        ctx.fillStyle = 'green';
        ctx.textAlign = 'left';
        ctx.fillText("FPS: "+FPS, 10, 20);
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
            score++;
        }

        makeSnake();
        makePoint();

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

        frameCount++;

        requestAnimationFrame(drawLoop);
    }

    drawLoop();
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
}
document.addEventListener('keydown', keyHandler, false);

setInterval(countFPS, 1000);

direction = 'down';
directionQueue = 'down';
ctx.beginPath();
createSnake();
createpoint();
