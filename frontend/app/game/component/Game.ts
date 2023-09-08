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
    let myPosition: number;
    let gameId: string;
  
    p5.setup = () => {
      p5.createCanvas(1200, 650);
      net =     new Net(p5);
      player1 = new Paddel(p5, true);
      player2 = new Paddel(p5, false);
    }
    
    p5.draw = () => {
      socket?.emit("getBallAndP2Positions", {id: gameId, user: user});
      p5.background(0);
      net.drow(p5);
      player1.drow(p5, 0);
      player2.drow(p5, opponentPos);
      let next = player1.update(p5);
      if(next != undefined && next != opponentPos){
        socket?.emit("setPositon", {id: gameId, user: user, pos: (next * 100 / p5.height)});
      }
    };

    p5.updateWithProps = (props: GameProps) => {
        socket = props.socket;
        user = props.user;
        gameId = props.gameId;
        if(props.opponentPos){
          opponentPos = (props.opponentPos * p5.height / 100);
        }
    };
}