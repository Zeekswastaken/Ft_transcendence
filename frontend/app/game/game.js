function Paddle(isLeft, upKey, downKey) {
	this.isLeft = isLeft;
	this.width = canvasWidth / 64;
	this.height = canvasHeight / 3.333;
	this.pos = createVector(0, (height / 2) - (this.height / 2));
	this.velocity = 5;
	this.score = 0;

	if(this.isLeft){
		this.pos.x = 2;
	}else {
		this.pos.x = width - this.width - 2;
	}

	this.draw = function() {
		rect(this.pos.x, this.pos.y, this.width, this.height);
	}

	this.update = function() {
		if (keyIsDown(upKey) && this.pos.y > 0) {
			this.pos.y -= this.velocity;
		} else if (keyIsDown(downKey) && this.pos.y + this.height < height) {
			this.pos.y += this.velocity;
		}
	}
}

function Ball() {
	this.pos = createVector(width / 2, height / 2);
	this.r = (canvasWidth * canvasHeight) / 20000;
	this.velocity = createVector(10, 4);

	this.draw = function() {
		ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
	}

	this.update = function(players) {

		for(var i = 0; i < players.length; i++){
			this.collide(players[i]);
		}

		if(this.pos.x > width){
			for(var i =0; i < players.length; i++){
				players[i].isLeft ? players[i].score++ : players[i].score;
			}
			this.drawMiddle();
			this.reset();
		} else if(this.pos.x < 0) {
			for(var i =0; i < players.length; i++){
				!players[i].isLeft ? players[i].score++ : players[i].score;
			}
			this.drawMiddle();
			this.reset();
		}else {
			this.bounce();
			this.pos.x += this.velocity.x;
			this.pos.y += this.velocity.y;
		}
	}

	this.bounce = function() {
		if (this.pos.y > height - this.r || this.pos.y < 0 + this.r) {
			this.velocity.y *= -1;
		}
	}

	this.reset = function(){

		var angle = random(-PI/4,PI/4);
		this.velocity.x = 5 * cos(angle);
		this.velocity.y = 5 * sin(angle);

		random(1) < 0.5 ? this.velocity.x *= -1 : this.velocity.x;
	}

	this.collide = function(player) {
		
		var rad = radians(45);

		if(player.isLeft){
			if (this.pos.x < player.pos.x + player.width + this.r) {
				if(this.pos.y > player.pos.y && this.pos.y < player.pos.y + player.height){
					var diff = this.pos.y - player.pos.y;
					var angle = map(diff, 0, player.height, -rad, rad);
					this.velocity.x = 5 * cos(angle);
					this.velocity.y = 5 * sin(angle);
				}
			}
		} else {
			if (this.pos.x > player.pos.x - this.r) {
				if(this.pos.y > player.pos.y && this.pos.y < player.pos.y + player.height){
					var diff = this.pos.y - player.pos.y;
					var angle = map(diff, 0, player.height, -rad, rad);
					this.velocity.x = (5 * cos(angle)) * -1;
					this.velocity.y = 5 * sin(angle);
				}
			}
		}	
	}

	this.drawMiddle = function(){
		this.pos.x = width/2;
		this.pos.y = height/2;
	}

	this.drawMiddle();
	this.reset();
}

const W_KEY = 87;
const S_KEY = 83;

function Pong(){
	this.leftPlayer  = new Paddle(true, W_KEY, S_KEY);
	this.rightPlayer = new Paddle(false, UP_ARROW, DOWN_ARROW);
    this.ball = new Ball();
    
    this.start = function(cond){
        if(cond){
            this.leftPlayer.draw();
            this.leftPlayer.update();

            this.rightPlayer.draw();
            this.rightPlayer.update();

            this.ball.draw();
            this.ball.update([this.leftPlayer,this.rightPlayer]);
            this.showScore();
        } else {
            this.leftPlayer.draw();
            this.rightPlayer.draw();
            this.ball.draw();
            this.showScore();
        }
    }

    this.showScore = function(){
        textSize(32);
        fill(255);
        text(this.leftPlayer.score, 10, 40);
        text(this.rightPlayer.score, width-40, 40);
    }
}

let startGame = false;
let pong;
const btnStart = document.getElementById('start');

btnStart.addEventListener('click', e => {
  btnStart.innerText = startGame ? 'Start!' : 'Pause!';
  startGame = !startGame;
});

const canvasWidth = 600;
const canvasHeight = 300;

function setup() {
	createCanvas(canvasWidth, canvasHeight).parent("holder");
	noStroke();
	pong = new Pong();
}

function draw() {
	background(0);
	pong.start(startGame);
}