export function radiansRange (degrees: number)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

export function mapRange (value: number, a: number, b: number, c: number, d: number) {
    value = (value - a) / (b - a);
    return c + value * (d - c);
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}