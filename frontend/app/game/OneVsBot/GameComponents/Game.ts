import { P5CanvasInstance } from "@p5-wrapper/react";
import Paddel from "../GameComponents/Player";
import Net from "../GameComponents/Net";
import Ball from "../GameComponents/Ball";
import { GameProps} from "../GameComponents/gameInterfaces";
import { Socket } from "socket.io-client";



export default function sketch(p5: P5CanvasInstance) {
    let player: Paddel;
    let computer: Paddel;
    let net    : Net;
    let ball   : Ball;
    let COM_LEVEL: number;
    let handlScore: number;
    let socket: Socket;
    let gameOver: boolean;

    p5.setup = () => {
      if (p5.windowWidth > 1500) {
        p5.createCanvas(1300, 700);
      } else if (p5.windowWidth <= 350 ) {
          p5.createCanvas(300, 150);
      } else {
        p5.createCanvas(p5.windowWidth - (p5.windowWidth / 6), p5.windowWidth / 1.99);
      }
      net     = new Net(p5);
      ball    = new Ball(p5);
      player = new Paddel(p5, true);
      computer = new Paddel(p5, false);
      p5.textFont('Helvetica');
      p5.textSize(p5.width / 20);
      p5.textAlign(p5.CENTER, p5.CENTER);
    }
    
    p5.draw = () => {
      if(!gameOver)
      {
        p5.background(0);
        net.drow(p5);
        ball.drow(p5);
        ball.update(p5, player, computer);
        ball.isOut(p5, socket, player, computer);
        player.drow(p5, 0);
        player.updatePlayer(p5);
        computer.drow(p5, 0);
        computer.updateComputer(p5, ball, COM_LEVEL);
      }
      else {
        p5.fill(255);
        p5.background(0);
        p5.text('Game Over', p5.width / 2, p5.height / 2);
      }
    };

    p5.windowResized = () => {
      if(p5.windowWidth < 1500 && p5.windowWidth > 350)
      {
        p5.resizeCanvas(p5.windowWidth - (p5.windowWidth / 6), p5.windowWidth / 1.99);
      } else if(p5.windowWidth <= 350 ) {
        p5.createCanvas(300, 150);
      }
      player.resize(p5, true);
      computer.resize(p5, false);
      net.resize(p5);
      ball.resize(p5);
      p5.textSize(p5.width / 20);
    }

    p5.updateWithProps = (props: GameProps) => {
      COM_LEVEL = props.COM_LEVEL;
      handlScore = props.handlScore;
      socket = props.socket;
      gameOver = props.gameOver;
  };
}