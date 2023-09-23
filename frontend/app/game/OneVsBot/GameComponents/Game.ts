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
    let startGame: boolean;
    let time: number;

    p5.setup = () => {
      if (p5.windowWidth < 1500 ) {
        p5.createCanvas(p5.windowWidth - (p5.windowWidth / 6), p5.windowWidth / 1.99);
      } else {
        p5.createCanvas(1200, 700);
      }
      net     = new Net(p5);
      ball    = new Ball(p5);
      player = new Paddel(p5, true);
      computer = new Paddel(p5, false);
      p5.textFont('Helvetica');
      p5.textSize(p5.width / 10);
      p5.textAlign(p5.CENTER, p5.CENTER);
      startGame = false;
      time = Date.now();
    }
    
    p5.draw = () => {
      if(startGame)
      {
          p5.background(0);
          net.drow(p5);
          ball.isOut(p5, socket, player, computer);
          player.drow(p5, 0);
          player.updatePlayer(p5);
          computer.drow(p5, 0);
          computer.updateComputer(p5, ball, COM_LEVEL);
          ball.drow(p5);
          ball.update(p5, player, computer);
      } else {
          p5.background(0);
          player.drow(p5, 0);
          computer.drow(p5, 0);
          p5.fill(255)
          
          if(Date.now() < time + 1000) {
            p5.text("3", p5.width / 2, p5.height / 2);
          } else if(Date.now() < time + 2000) {
            p5.text("2", p5.width / 2, p5.height / 2);
          } else if(Date.now() < time + 3000) {
            p5.text("1", p5.width / 2, p5.height / 2);
          } else {
            startGame = true;
          }
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
  };
}