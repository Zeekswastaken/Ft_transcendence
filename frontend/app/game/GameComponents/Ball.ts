import { P5CanvasInstance } from "@p5-wrapper/react"

export default class Ball {
    radius: number;

    constructor (p5: P5CanvasInstance)
    {
        this.radius = p5.width / 30;
    }

    resize = (p5: P5CanvasInstance) => {
        this.radius = p5.width / 30;
    }

    drow (p5: P5CanvasInstance, x: number, y: number) {
        p5.fill(225);
        p5.circle((x * p5.width) / 100 , (y * p5.height) / 100, this.radius);
    }
}