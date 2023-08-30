import { start } from "repl";
import { couldStartTrivia } from "typescript";

const CANVA_WIDTH = 1200;
const CANVA_HEIGHT = 600;
const PLAYER_HEIGHT = CANVA_HEIGHT / 4;
const PLAYER_WIDTH = CANVA_WIDTH / 64;
const BALL_START_SPEED = 1;
const COM_LEVEL = 0.1;
const BALL_DELTA_SPEED = 0.1;

let  ctx: CanvasRenderingContext2D;

interface Ball {
    x: number;
    y: number;
    radius: number;
    speed: number;
    vX: number;
    vY: number;
    color: string;
}

interface Player {
    isLeft: boolean;
    x: number,
    y: number,
    width: number,
    height: number,
    score: number,
    color: string,
}

interface Net {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
}


const net: Net = {
    x: 0,
    y: 0, 
    width: 6,
    height: 50,
    color: "#FFFFFF",
}

const player1 : Player = {
    isLeft: true,
    x: 0,
    y: 0,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    color: "#A0009D",
    score: 0,
}

const player2 : Player= {
    isLeft: false,
    x: 0,
    y: 0,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    color: "#FF1382",
    score: 0,
}

const ball : Ball = {
    x: 0,
    y: 0,
    radius: (CANVA_WIDTH * CANVA_HEIGHT) / 40000,
    speed: BALL_START_SPEED,
    vX: 5,
    vY: 5,
    color: "#FFF",

}

function radiansRange (degrees: number)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

function mapRange (value: number, a: number, b: number, c: number, d: number) {
    value = (value - a) / (b - a);
    return c + value * (d - c);
}

const drawRectangle = (context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) => {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

const drawCircle = (context: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) => {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
}

const drawNet = (context: CanvasRenderingContext2D) =>
{
    for(let i = 0; i < context.canvas.height; i += 80)
    {
        drawRectangle(context, net.x, net.y + i, net.width, net.height, net.color);
    }
}

export const render = (context: CanvasRenderingContext2D, startGame: boolean, handelScore: any) => {
    if(startGame)
        update(context, handelScore);
    drawRectangle(context, 0, 0, context.canvas.width, context.canvas.height, "#000000");
    drawNet(context);
    drawRectangle(context, player1.x, player1.y, player1.width, player1.height, player1.color);
    drawRectangle(context, player2.x, player2.y, player2.width, player2.height, player2.color);
    drawCircle(context, ball.x, ball.y, ball.radius, ball.color);

}

export const initVars = (context: CanvasRenderingContext2D) => {
    net.x = context.canvas.width / 2 - 1;
    player1.y = context.canvas.height / 2 - PLAYER_HEIGHT / 2;
    player2.x = context.canvas.width - PLAYER_WIDTH;
    player2.y = context.canvas.height/ 2 - PLAYER_HEIGHT / 2;
    ball.x = context.canvas.width / 2;
    ball.y = context.canvas.height / 2;
    ball.speed = BALL_START_SPEED;
}

const  collision = (b: any, p: any) => {
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return (b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom );
}

const lerp = (a: number, b: number, t: number) => {
    return (a + (b - a) * t);
}

const resetBall = (context: CanvasRenderingContext2D) => {
    ball.x = context.canvas.width / 2;
    ball.y = context.canvas.height / 2;
    ball.vX = -ball.vX;
    ball.speed = BALL_START_SPEED;
}

const update = (context: CanvasRenderingContext2D, handelScore: any) => {
    ball.x += ball.vX * ball.speed;
    ball.y += ball.vY * ball.speed;
    var rad = radiansRange(45);

    if(ball.y + ball.radius > context.canvas.height || ball.y - ball.radius < 0)
        ball.vY = -ball.vY;
    let selectPlayer = ball.x < context.canvas.width / 2 ? player1 : player2;
    if(collision(ball, selectPlayer))
    {
        if(selectPlayer == player1)
        {
            var diff = ball.y - selectPlayer.y;
            var angle = mapRange(diff, 0, selectPlayer.height, -rad, rad);
            ball.vX = 5 * Math.cos(angle);
            ball.vY = 5 * Math.sin(angle);
        }
        else
        {
            var diff = ball.y - selectPlayer.y;
            var angle = mapRange(diff, 0, selectPlayer.height, -rad, rad);
            ball.vX = (5 * Math.cos(angle)) * -1; 
            ball.vY = 5 * Math.sin(angle); 
        }
        ball.speed += BALL_DELTA_SPEED;
        console.log(ball.speed);
    }
    
    let targetPos: number = ball.y - player2.height / 2;
    let currentPos: number = player2.y;
    player2.y = lerp(currentPos, targetPos, COM_LEVEL);

    context.canvas.addEventListener("mousemove", (e) => {
        let rect = context.canvas.getBoundingClientRect();
        player1.y = e.clientY - rect.top - player1.height / 2;
    });

    if(ball.x - ball.radius < 0)
    {
        player2.score++;
        handelScore(2);
        console.log("Player 1: " + player1.score + " Player 2: " + player2.score);
        resetBall(context);
    } else  if(ball.x + ball.radius > context.canvas.width)
    {
        player1.score++;
        handelScore(1);
        console.log("Player 1: " + player1.score + " Player 2: " + player2.score);
        resetBall(context);
    }
}