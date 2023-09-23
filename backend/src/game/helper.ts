import { Ball, Player, BallBoundary, PlayerBoundary } from "./gameInterfaces";

export function radiansRange (degrees: number)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

export function mapRange (value: number, a: number, b: number, c: number, d: number) {
    value = (value - a) / (b - a);
    return c + value * (d - c);
}

export const  collision = (ball: Ball, player: Player) => {
  let b: BallBoundary = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  let p: PlayerBoundary = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  b.top = ball.y - ball.radius;
  b.bottom = ball.y + ball.radius;
  b.left = ball.x - ball.radius;
  b.right = ball.x + ball.radius;
  
  p.top = player.y;
  p.bottom = player.y + 25;
  if(player.isLeft)
  {
    p.left = 0.5;
    p.right = 2.5;
  } else {
    p.left = 97.5;
    p.right =  97.5 + 2;
  }

  return (b.right >= p.left && b.bottom >= p.top && b.left <= p.right && b.top <= p.bottom );
}

export const initBall = (ball: Ball) => {
    ball.x = 50;
    ball.y = 50;
    ball.radius = 3;
    ball.speed = 1;
    ball.direction++;
    if(ball.direction % 2 == 0) {
      ball.vX = -0.5;
      ball.vY = -0.5;
    }
    else {
      ball.vX = 0.5;
      ball.vY = 0.5;
    }
    ball.deltaSpeed += 0.03;
}