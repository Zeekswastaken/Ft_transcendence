import { P5CanvasInstance } from "@p5-wrapper/react";
import { Socket } from "socket.io-client";
import Paddel from "./Player";
import Net from "./Net";
import { User } from "./gameInterfaces";

export default class GameModule {
  private p5: P5CanvasInstance;
  private player1: Paddel;
  private player2: Paddel;
  private net: Net;
  private socket: Socket;
  private user: User;
  private opponentPos: number;
  private gameId: string;

  constructor(p5: P5CanvasInstance) {
    this.p5 = p5;
    this.player1 = new Paddel()
  }

  setup() {
    let width = this.p5.windowWidth / 1.2;
    if (width > 1200) {
      width = 1200;
    }
    this.p5.createCanvas(width, width / 1.9);
    this.net = new Net(this.p5);
    this.player1 = new Paddel(this.p5, true, this.socket, this.gameId, this.user);
    this.player2 = new Paddel(this.p5, false, this.socket, this.gameId, this.user);
  }

  draw() {
    this.p5.background(0);
    this.net.drow(this.p5);
    this.player1.drow(this.p5, this.opponentPos);
    this.player2.drow(this.p5, this.opponentPos);
  }

  windowResized() {
    const width = this.p5.windowWidth / 1.2;
    if (width < 1200) {
      this.p5.resizeCanvas(width, width / 1.9);
      this.net = new Net(this.p5);
      this.player1 = new Paddel(this.p5, true, this.socket, this.gameId, this.user);
      this.player2 = new Paddel(this.p5, false, this.socket, this.gameId, this.user);
    }
  }
}
