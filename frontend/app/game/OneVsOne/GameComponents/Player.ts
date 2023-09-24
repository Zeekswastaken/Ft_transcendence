import { Player } from "./gameInterfaces";
import { P5CanvasInstance } from "@p5-wrapper/react";

export default class Paddel implements Player{
    isLeft: boolean;
    pos: any;
    width: number;
    height: number;
    gap: number;
    score: number;
    color: string;

    constructor(p5: P5CanvasInstance, isLeft: boolean) {
        this.isLeft = isLeft;
        this.width = p5.width / 50;
        this.height = p5.height / 4;
        this.gap = this.width / 2;
        this.score = 0;
        this.pos = p5.createVector(0, (p5.height / 2) - (this.height / 2));
        
        if(this.isLeft) {
            this.color = "#A0009D";
            this.pos.x = this.gap;
        }
        else
        {
            this.color = "#FF1382";
            this.pos.x = p5.width - this.width - this.gap;
        }
    }

    resize = (p5: P5CanvasInstance, isLeft: boolean) => {
        this.isLeft = isLeft;
        this.width = p5.width / 50;
        this.height = p5.height / 4;
        this.gap = this.width / 2;
        this.score = 0;
        this.pos = p5. createVector(0, (p5.height / 2) - (this.height / 2));
        
        if(this.isLeft) {
            this.pos.x = this.gap;
        }
        else {
            this.pos.x = p5.width - this.width - this.gap;
        }
    }

    drow (p5: P5CanvasInstance, pos: number) {
        p5.fill(this.color);
        if(this.isLeft) {
            p5.rect(this.pos.x, pos, this.width, this.height, this.width);
        }
        else {
            p5.rect(this.pos.x, pos, this.width, this.height, this.width);
        }
    }

    update(p5: P5CanvasInstance)
    {
        if(this.isLeft){
            if(p5.mouseY <  (p5.height - this.height / 2) && p5.mouseY > 0 - this.height / 2){
                this.pos.y = p5.mouseY;
                return (this.pos.y);
            }
        }
    }
}