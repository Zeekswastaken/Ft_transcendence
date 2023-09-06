import { couldStartTrivia } from "typescript";
import { Socket } from "socket.io-client";
import { Player } from "./gameInterfaces";
import { P5CanvasInstance } from "@p5-wrapper/react";

export default class Paddel implements Player{
    isLeft: boolean;
    pos: any;
    width: number;
    height: number;
    velocity: number;
    score: number;
    color: string;
    sendPosition: any;

    constructor(p5: P5CanvasInstance, isLeft: boolean, sendPosition: any) {
        this.sendPosition = sendPosition;
        this.isLeft = isLeft;
        this.width = p5.width / 64;
        this.height = p5.height / 3.333;
        this.velocity = this.height / 10;
        this.score = 0;
        this.pos = p5. createVector(0, (p5.height / 2) - (this.height / 2));
        if(this.isLeft) {
            this.color = "#FF0000";
            this.pos.x = 2;
        }
        else
        {
            this.color = "#00FF00";
            this.pos.x = p5.width - this.width - 2;
        }
    }

    drow (p5: P5CanvasInstance, position: number) {
        if(!this.isLeft){
            this.pos.y = position;
        }
        p5.fill(this.color);
        if(this.isLeft)
            p5.rect(this.pos.x, this.pos.y, this.width, this.height);
        this.update(p5);
    }

    update(p5: P5CanvasInstance)
    {
        if(this.isLeft){
            if(p5.mouseY <  (p5.height - this.height / 2) && p5.mouseY > 0 - this.height / 2){
                this.pos.y = p5.mouseY;
                this.sendPosition(this.pos.y);
            }
        }
        else {
        }
    }

    

}