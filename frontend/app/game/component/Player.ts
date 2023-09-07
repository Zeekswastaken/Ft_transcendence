import { Socket } from "socket.io-client";
import { Player, User } from "./gameInterfaces";
import { P5CanvasInstance } from "@p5-wrapper/react";

export default class Paddel implements Player{
    isLeft: boolean;
    pos: any;
    width: number;
    height: number;
    gap: number;
    score: number;
    color: string;
    socket: Socket;
    gameId: string;
    user: User;

    constructor(p5: P5CanvasInstance, isLeft: boolean, socket: Socket, gameId: string, user: User) {
        this.isLeft = isLeft;
        this.socket = socket;
        this.user = user;
        this.gameId = gameId;
        this.width = p5.width / 64;
        this.height = p5.height / 4;
        this.gap = this.width / 2;
        this.score = 0;
        this.pos = p5. createVector(0, (p5.height / 2) - (this.height / 2));
        
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

    drow (p5: P5CanvasInstance, pos: number) {
        p5.fill(this.color);
        p5.rect(this.pos.x, this.pos.y, this.width, this.height, this.width);
        if(this.isLeft) {
            this.update(p5);
        }
    }

    update(p5: P5CanvasInstance)
    {
        if(this.isLeft){
            if(p5.mouseY <  (p5.height - this.height / 2) && p5.mouseY > 0 - this.height / 2){
                let prPos = this.pos.y;
                this.pos.y = p5.mouseY;
                if(this.pos.y != prPos) {
                    this.socket?.emit("setPositon", {id: this.gameId, user: this.user , pos: this.pos.y});
                }
            }
        }
    }

    

}