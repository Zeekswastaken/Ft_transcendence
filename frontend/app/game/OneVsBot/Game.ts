import { P5CanvasInstance } from "@p5-wrapper/react";
import { Socket } from "socket.io-client";
import Paddel from "../GameComponents/Player";
import Net from "../GameComponents/Net";
import Ball from "../GameComponents/Ball";
import { BallCoordinates, GameProps, User } from "../GameComponents/gameInterfaces";



export default function sketch(p5: P5CanvasInstance) {
    let player1: Paddel;
    let player2: Paddel;
    let net    : Net;
    let ball   : Ball;
    let ballCoordinates: BallCoordinates = {
      x: 50,
      y: 50
    };
  
    p5.setup = () => {
      if(p5.windowWidth > 1500)
      {
        p5.createCanvas(1300, 700);
      }else if(p5.windowWidth <= 350 ) {
          p5.createCanvas(300, 150);
      }
      else {
        p5.createCanvas(p5.windowWidth - (p5.windowWidth / 6), p5.windowWidth / 1.99);
      }
      net     = new Net(p5);
      ball    = new Ball(p5);
      player1 = new Paddel(p5, true);
      player2 = new Paddel(p5, false);
    }
    
    p5.draw = () => {
      p5.background(0);
      net.drow(p5);
      ball.drow(p5, ballCoordinates.x, ballCoordinates.y);
      player1.drow(p5, 0);
      player2.drow(p5, 0);
    };

    p5.windowResized = () => {
      if(p5.windowWidth < 1500 && p5.windowWidth > 350)
      {
        p5.resizeCanvas(p5.windowWidth - (p5.windowWidth / 6), p5.windowWidth / 1.99);
      } else if(p5.windowWidth <= 350 ) {
        p5.createCanvas(300, 150);
      }
      player1.resize(p5, true);
      player2.resize(p5, false);
      net.resize(p5);
      ball.resize(p5);
    }
}