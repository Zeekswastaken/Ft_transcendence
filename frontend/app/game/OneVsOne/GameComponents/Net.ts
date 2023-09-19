import { P5CanvasInstance } from "@p5-wrapper/react"

export default class Net {
    width: number;
    height: number;
    gap: number;
    x: number;
    y: number;

    constructor (p5: P5CanvasInstance)
    {
        this.width = p5.width / 150;
        this.height = p5.height / 10;
        this.gap = p5.height / 20;
        this.x = p5.width / 2 - this.width / 2;
        this.y = 0;
    }

    resize = (p5: P5CanvasInstance) => {
        this.width = p5.width / 150;
        this.height = p5.height / 10;
        this.gap = p5.height / 20;
        this.x = p5.width / 2 - this.width / 2;
        this.y = 0
    }

    drow (p5: P5CanvasInstance) {
        for(let i = 0; i < p5.height; i += this.height + this.gap)
        {
            p5.fill(225);
            p5.rect(this.x, this.y + i, this.width, this.height, this.width);
        }
    }
}