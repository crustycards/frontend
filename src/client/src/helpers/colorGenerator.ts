import {SHA256} from './hash';

class Color {
  public r: number;
  public g: number;
  public b: number;

  constructor(r: number, g: number, b: number) {
    if (Math.max(r, g, b) > 255) {
      throw new Error('All values must be less than or equal to 255');
    }
    if (Math.min(r, g, b) < 0) {
      throw new Error('All values must be greater than or equal to 0');
    }
    this.r = r;
    this.g = g;
    this.b = b;
  }

  public toCssString(): string {
    return `rgb(${this.r}, ${this.g}, ${this.b})`;
  }
}

const hsvToRgb = (h: number, s: number, v: number): Color => {
  let r, g, b, i, f, p, q, t;
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
      case 0: r = v, g = t, b = p; break;
      case 1: r = q, g = v, b = p; break;
      case 2: r = p, g = v, b = t; break;
      case 3: r = p, g = q, b = v; break;
      case 4: r = t, g = p, b = v; break;
      case 5: r = v, g = p, b = q; break;
  }
  return new Color(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
};

const parseHexString = (str: string, charsPerNumber = 8): number[] => {
  const result = [];
  while (str.length >= charsPerNumber) {
      result.push(parseInt(str.substring(0, charsPerNumber), 16));

      str = str.substring(charsPerNumber, str.length);
  }
  return result;
};

const pickColor = (rand: number[]): Color => {
  return hsvToRgb(((rand[0] % 31) + 1) / 32, 1, rand[1] % 2 === 0 ? 0.8 : 0.5);
};

export const stringToCssColor = (str: string) => {
  const color = pickColor(parseHexString(SHA256(str), 4));
  return color.toCssString();
};
