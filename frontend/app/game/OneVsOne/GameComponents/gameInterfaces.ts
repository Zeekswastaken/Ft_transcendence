import { Socket } from "socket.io-client";
export interface Ball {
    x: number;
    y: number;
    radius: number;
    speed: number;
    vX: number;
    vY: number;
    color: string;
}

export interface Player {
    isLeft: boolean;
    pos: any;
    width: number,
    height: number,
    score: number,
    gap: number;
    color: string,
}

export interface Net {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
}

export interface User {
    username: string;
    avatar_url: string;
}

export interface GameProps {
    socket : Socket;
    user: any;
    opponent: any;
    gameId: string;
    opponentPos: number;
    ballCoordinates: BallCoordinates,
    gameOver: boolean;
}

export interface net {
    height: number;
    width: number;
}

export interface BallCoordinates {
    x: number;
    y: number;
}