import { P5CanvasInstance } from "@p5-wrapper/react";
import { Socket } from "socket.io-client";
import Paddel from "./Player";
import Net from "./Net";
import { GameProps, User } from "./gameInterfaces";



export default function sketch(p5: P5CanvasInstance) {
    let player1: Paddel;
    let player2: Paddel;
    let net    : Net;
    let socket : Socket;
    let user: User;
    let opponentPos: number;
    let gameId: string;
  
    p5.setup = () => {
      let width = p5.windowWidth / 1.2;
      if(width > 1200) {
        width = 1200;
        p5.createCanvas(width, width / 1.9)
      } else {
        p5.createCanvas(width, width / 1.9);
      }
      p5.createCanvas(1200, 650);
      net =     new Net(p5);
      player1 = new Paddel(p5, true, socket, gameId, user); // player 1 want to send his positon.
      player2 = new Paddel(p5, false, socket, gameId, user); //player 2 want to recive the player 1 position.
    }
    
    p5.draw = () => {
      p5.background(0);
      net.drow(p5);
      player1.drow(p5, opponentPos);
      player2.drow(p5, opponentPos);
    };

    p5.windowResized = () => {
      const width = p5.windowWidth / 1.2;
      if(width < 1200)
      {
        p5.resizeCanvas(width, width / 1.9);
        net     = new Net(p5);
        player1 = new Paddel(p5, true, socket, gameId, user);
        player2 = new Paddel(p5, false, socket, gameId, user);
      }
    }

    p5.updateWithProps = (props: GameProps) => {
      if (props.socket !== undefined) {
        socket = props.socket;
      }
      if(props.user !== undefined)
      {
        user = props.user;
      }
      if(props.gameId !== undefined)
      {
        gameId = props.gameId;
      }
    };
}