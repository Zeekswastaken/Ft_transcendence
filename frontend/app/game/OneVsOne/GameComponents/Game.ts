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
    let socket : Socket;
    let user: User;
    let opponentPos: number;
    let gameId: string;
    let pos: number;
    let startGame: boolean;
    let time: number;
    let ballCoordinates: BallCoordinates = {
      x: 50,
      y: 50
    };
  
    p5.setup = () => {
      console.log("=================> p5.windowWidth", document.documentElement.clientWidth);
     if(document.documentElement.clientWidth < 1500 ) {
        p5.createCanvas(document.documentElement.clientWidth - (document.documentElement.clientWidth / 6), document.documentElement.clientWidth / 1.99);
      } else {
        p5.createCanvas(1200, 700);
      }
      net     = new Net(p5);
      ball    = new Ball(p5);
      player1 = new Paddel(p5, true);
      player2 = new Paddel(p5, false);
      pos;
      p5.textFont('Helvetica');
      p5.textSize(p5.width / 20);
      p5.textAlign(p5.CENTER, p5.CENTER);
      startGame = false;
      time = Date.now();
      opponentPos = player2.pos.y;
    }
    
    p5.draw = () => {
      if(startGame) {
        socket?.emit("getBallAndP2Positions", {id: gameId, user: user});
        p5.background(0);
        net.drow(p5);
        ball.drow(p5, ballCoordinates.x, ballCoordinates.y);
        player1.drow(p5, player1.pos.y);
        player2.drow(p5, opponentPos);
        let next = player1.update(p5);
        if(next != undefined && next != pos) {
          socket?.emit("setPositon", {id: gameId, user: user, pos: (next * 100 / p5.height)});
        }
        pos = next;
      } else {
        p5.background(0);
        player1.drow(p5, player1.pos.y);
        player2.drow(p5, player2.pos.y);
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
      player1.resize(p5, true);
      player2.resize(p5, false);
      net.resize(p5);
      ball.resize(p5);
      p5.textSize(p5.width / 20);
    }

    p5.updateWithProps = (props: GameProps) => {
        socket = props.socket;
        user = props.user;
        gameId = props.gameId;
        if(props.opponentPos != undefined){
          opponentPos = (props.opponentPos * p5.height / 100);
        }
        if(props.ballCoordinates) {
          ballCoordinates = props.ballCoordinates;
        }
    };
}