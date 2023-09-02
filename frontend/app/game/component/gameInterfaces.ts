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
    x: number,
    y: number,
    width: number,
    height: number,
    score: number,
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