
import { User } from "src/database/user.entity";

export interface Player {
    isLeft: boolean;
    isReady: boolean;
    data: User;
    y: number;
    score: number
}
  
export interface Ball {
    x: number;
    y: number;
    radius: number;
    speed: number;
    vX: number;
    vY: number;
    direction: number;
    deltaSpeed: number;
}

export interface BallCoordinates {
    x: number;
    y: number;
}

export interface BallBoundary {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export interface PlayerBoundary {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export interface GameData {
    player1: Player;
    player2: Player;
    ball:    Ball;
}