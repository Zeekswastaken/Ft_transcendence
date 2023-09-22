import { Socket } from "socket.io-client";
export interface Ball {
    
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
    COM_LEVEL: number;
    handlScore: any;
    socket: Socket;
}

export interface net {
    height: number;
    width: number;
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

export interface Result {
    user: User;
    bot: User;
    playerScore: number;
    bootScore: number;
}