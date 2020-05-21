//---------------------Constants and Variable declaration
// TODO: Move test code to seperate upsable file
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let run;
let running = false;
let paused = false;
let timeRunning = 0;
let percentageInfected = 0;
let simCache;
let sim;
/* Old test code
let testFigure = {
	color: "yellow",
	width: 10,
	height: 10,
	pos_x: 0,
	pos_y: 0,
	speed: 20,
	move: function() {
		if((this.pos_x + this.speed) > canvas.width) {
			this.pos_y += 10;
			this.pos_x = 0;
		} else if((this.pos_y + 1) > canvas.height) {
			this.pos_y = 0;
		} else {
			this.pos_x += this.speed;
		}
	}
};

let testFigure2 = {
	color: "red",
	width: 10,
	height: 10,
	pos_x: 0,
	pos_y: 0,
	speed: 50,
	move: function() {
		if((this.pos_x + this.speed) > canvas.width) {
			this.pos_y += 15;
			this.pos_x = 0;
		} else if((this.pos_y + 1) > canvas.height) {
			this.pos_y = 0;
		} else {
			this.pos_x += this.speed;
		}
	}
};

let group = [testFigure, testFigure2];
*/


//Class Definitions
/*TODO:
	Move to seperate file (possibly?)

*/
class Person {
	constructor(status = "healthy", color="yellow") {
		this.color = color;
		this.status = status;
		this.width = 10;
		this.height = 10;
		this.pos_x = getRandomInt(0, canvas.width - 1);
		this.pos_y = getRandomInt(0, canvas.height - 1);
		this.speed = 5;
		this.direction = 'r';
	}

	//Methods

	move() {
		switch (this.direction) {
			case 'r':
				this.moveRight();
				break;
			case 'd':
				this.moveDown();
				break;
			case 'l':
				this.moveLeft();
				break;
			case 'u':
				this.moveUp();
		}
	}

	moveRight() {
		if((this.pos_x + this.width) > canvas.width) { //check if move places self outside of canvas width
			//Move to the beginning of next line istead
			this.moveLeft();
			this.direction = 'l';
		} /* else if((this.pos_y + 1) > canvas.height) { //Check if bottom of canvas is reached
			//Move to the top instead
			this.pos_y = 0;
		}
		*/ else { //otherwise continue move
			this.pos_x += this.speed;
		}
	}

	moveLeft() {
		if((this.pos_x - this.width) < 0) { //check if move places self outside of canvas width
			this.moveRight();
			this.direction = 'r';
		} else {
			this.pos_x -= this.speed;
		}
	}

	moveUp() {
		if((this.pos_y - this.height) < 0) { //check if move places self outside of canvas height
			this.moveDown();
			this.direction = 'd';
		} else {
			this.pos_y -= this.speed;
		}
	}

	moveDown() {
		if((this.pos_y + this.height) > canvas.height) { //check if move places self outside of canvas height
			this.moveUp();
			this.direction = 'u';
		} else {
			this.pos_y += this.speed;
		}
	}

	changeDirectionRandomly() {
		switch (getRandomInt(0, 4)) {
			case 0:
				this.direction = 'r';
				break;
			case 1:
				this.direction = 'd';
				break;
			case 2:
				this.direction = 'l';
				break;
			case 3:
				this.direction = 'u';
		}
	}

	// Getter
	getPosition() {
		return [this.pos_x, this.pos_y];
	}

	//Setter
	setPosition(x,y) {
		this.pos_x = x;
		this.pos_y = y;
	}
}

class Cache {
	constructor(inputArr = [], t) {
			this.cacheArr = inputArr;
			this.timeRunning = t;
	}

	getCache() {
		return this.cacheArr;
	}

	setCache(inputArr = [], time) {
		this.cacheArr = inputArr;
		this.timeRunning = time;
	}

	getTimeRunning() {
		return this.timeRunning;
	}

	setTimeRuing(t) {
		this.timeRunning = t;
	}
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
//---------------------Function definitions
function drawRect(color, pos_x, pos_y, width, height) {
	ctx.fillStyle = color;
	ctx.fillRect(pos_x, pos_y, width, height);

}

//Does the same as draw rect but takes an object instead ob multiple attributes
function drawRect2(figure) {
		ctx.fillStyle = figure.color;
		ctx.fillRect(figure.pos_x, figure.pos_y, figure.width, figure.height);
		//requestAnimationFrame(drawRect2);
}

function clearCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function pauseSim() {
	if (running) {
		console.log("Sim paused");
		running = false;
		paused = true;
		clearInterval(sim);
	} else {
		console.log("Sim unpaused");
		startSim();s
	}
}

function stopSim() {
	console.log("Sim stopped");
	running = false;
	paused = false;
	timeRunning = 0;
	clearInterval(sim);
}

function populateSim(num_of_people, percentageInfected) {
	let population = [];
	let numInfected = Math.ceil((num_of_people/100) * percentageInfected);

	console.log("Populating world with " + numInfected + " people infected");

	let i = 0;
	for(i; i < numInfected; i++) {
		population[i] = new Person(status="sick", color="red");
	}
	for (i; i < num_of_people; i++) {
		population[i] = new Person();
	}
	return population;
}

//// TODO: Write Comments... Hahaha...
function startSim() {
	if (!paused) {
		simCache = new Cache();
		let populationNumber = document.getElementById("population").value;
		percentageInfected = document.getElementById("infected").value;
		var timeout = document.getElementById("timeout").value;
	 	var activePopulation = populateSim(populationNumber, percentageInfected);
	 	timeRunning = 0;
	} else if (paused) {
		var timeout = document.getElementById("timeout").value;
	 	var activePopulation = simCache.getCache();
	 	timeRunning = simCache.getTimeRunning();
	}

	running = true;
	console.log("Sim started");
	sim = setInterval( function() { testrun(activePopulation, timeout); }, 200 );
	return;
}

// TODO: Write Comments... Haha... ha...
function testrun(population, timeout) {
	clearCanvas();
	for(e of population) {
		drawRect2(e);

		//Change direction every 1 in x times
		if (getRandomInt(1, 8) == 4) {
			e.changeDirectionRandomly();
		}
		e.move();
	}

	simCache.setCache(population, timeRunning);

	timeRunning += 200;
	if (timeout != 0) {
		console.log("Running: " +(timeRunning/1000) + "s, " + "Time remaining: " + ( (timeout*60) - (timeRunning/1000) ) + "s");
		if (timeRunning >= (1000 * (timeout * 60))) {
			alert("Sim Timeout");
			console.log("_Sim Timeout_");
			stopSim();
		}
	} else {
		console.log("Running: " +(timeRunning/1000) + "s ");
	}
}
