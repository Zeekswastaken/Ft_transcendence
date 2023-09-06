import { P5CanvasInstance } from "@p5-wrapper/react";
import { Socket } from "socket.io-client";
import Paddel from "./Player";
import { GameProps } from "./gameInterfaces";


export default function sketch(p5: P5CanvasInstance) {
    let player1: Paddel;
    let player2: Paddel;
    let sendPosition: any;
    let getBallAndP2: any;
  
    p5.setup = () => {
      // let width = p5.windowWidth / 1.2;
      // if(width > 1200) {
      //   width = 1200;
      //   p5.createCanvas(width, width / 1.9)
      // } else {
      //   p5.createCanvas(width, width / 1.9);
      // }
      p5.createCanvas(1200, 650);
      player1 = new Paddel(p5, true, sendPosition);
      player2 = new Paddel(p5, false, sendPosition);
    }
    
    p5.draw = () => {
      let data = getBallAndP2;
      console.log("data = " + data);
      p5.background(0);
      player1.drow(p5, 0);
      player2.drow(p5, data);
    };

    // p5.windowResized = () => {
    //   const width = p5.windowWidth / 1.2;
    //   if(width < 1200)
    //   {
    //     p5.resizeCanvas(width, width / 1.9);
    //     player1 = new Paddel(p5, true);
    //     player2 = new Paddel(p5, false);
    //   }
    // }

    p5.updateWithProps = (props: GameProps) => {
      if (props.sendPosition) {
        sendPosition = props.sendPosition;
      }
      if(getBallAndP2)
      {
        getBallAndP2 = props.getBallAndP2;
      }
    };
}