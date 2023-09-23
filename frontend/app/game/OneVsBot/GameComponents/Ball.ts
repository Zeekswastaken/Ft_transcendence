import { P5CanvasInstance } from "@p5-wrapper/react"
import Paddel from "./Player";
import { radiansRange, mapRange } from "./helper";
import { BallBoundary, PlayerBoundary } from "./gameInterfaces";
import { Socket } from "socket.io-client";

export default class Ball {
    x: number;
    y: number;
    radius: number;
    speed: number;
    vX: number;
    vY: number;
    direction: number;
    color: string;
    deltaSpeed: number;

    constructor (p5: P5CanvasInstance)
    {
        this.radius = p5.width / 30;
        this.x = p5.width / 2;
        this.y = p5.height / 2;
        this.speed = 1;
        this.vX = 5;
        this.vY = 5;
        this.direction = 1;
        this.color = "#FFFFFF";
        this.deltaSpeed = 0.2;
    }

    resize = (p5: P5CanvasInstance) => {
        this.radius = p5.width / 30;
    }

    drow (p5: P5CanvasInstance) {
        p5.fill(this.color);
        p5.circle(this.x , this.y, this.radius);
    }

    update(p5: P5CanvasInstance, player: Paddel, computer: Paddel) {
        this.x += this.vX * this.speed;
        this.y += this.vY * this.speed;
        var rad = radiansRange(45);
        if(this.y + this.radius / 2 >= p5.height || this.y - this.radius / 2 <= 0) {
            if(this.y + this.radius / 2 >= p5.height) {
                this.y = p5.height - this.radius / 2;
            } else {
                this.y = this.radius / 2;
            }
            this.vY = -this.vY;
        }
        let selectPlayer = this.x < p5.width / 2 ? player : computer;
        if(this.collision(p5, selectPlayer))
        {
            if(selectPlayer == player)
            {
                var diff = this.y - selectPlayer.pos.y;
                var angle = mapRange(diff, 0, player.height, -rad, rad);
                this.vX = 10 * Math.cos(angle);
                this.vY = 10 * Math.sin(angle);
            }
            else
            {
                var diff = this.y - selectPlayer.pos.y;
                var angle = mapRange(diff, 0, player.height, -rad, rad);
                this.vX = (10 * Math.cos(angle)) * -1; 
                this.vY = (10 * Math.sin(angle)); 
            }
            this.speed += this.deltaSpeed;
        }
    }

    isOut(p5: P5CanvasInstance, socket: Socket, player: Paddel, computer: Paddel)
    {
        
        if(this.x  < 0) {
            computer.score++;
            socket.emit("oneVsBotChangeScore", {player: player.score, bot: computer.score});
            this.reset(p5);
        } else  if(this.x > p5.width){
            player.score++;
            socket.emit("oneVsBotChangeScore", {player: player.score, bot: computer.score});
            this.reset(p5);
        }
    }

    reset(p5: P5CanvasInstance)
    {
        this.x = p5.width / 2;
        this.y = p5.height / 2;
        this.speed = 1;
        this.vX = 5;
        this.direction++;
        if(!(this.direction % 2)) {
            this.vX = -this.vX;
        }
        this.vY = -5;
        this.deltaSpeed += 0.01;
    }

    collision(p5: P5CanvasInstance, player: Paddel)
    {
        let b: BallBoundary = {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        };
        
        let p: PlayerBoundary = {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        };

        b.top = this.y - (this.radius / 2);
        b.bottom = this.y + (this.radius / 2);
        b.left = this.x - (this.radius / 2);
        b.right = this.x + (this.radius / 2) ;
        
        p.top = player.pos.y;
        p.bottom = player.pos.y + player.height;
        p.left = player.pos.x;
        p.right = player.pos.x + player.width;
        
        return (b.right >= p.left && b.bottom >= p.top && b.left <= p.right && b.top <= p.bottom );
    }
}