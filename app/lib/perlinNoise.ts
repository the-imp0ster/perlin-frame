import { createCanvas } from 'canvas';
import { Noise } from 'noisejs';

export async function generatePerlinNoise(farcasterId: number): Promise<Buffer | string> {
  const perlin = new Noise(farcasterId || Math.random());
  try {
    const canvas = createCanvas(400, 400);
    const ctx = canvas.getContext('2d');

    // white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const scale = 35;

    const hsvToRgb = (h: number, s: number, v: number) => {
      let r = 0, g = 0, b = 0;
      const i = Math.floor(h * 6);
      const f = h * 6 - i;
      const p = v * (1 - s);
      const q = v * (1 - f * s);
      const t = v * (1 - (1 - f) * s);

      switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
        default: break;
      }
      return `rgb(${Math.floor(r * 255)}, ${Math.floor(g * 255)}, ${Math.floor(b * 255)})`;
    };

    const getColor = (value: number) => {
      const hue = (value + 1) / 1.05;
      return hsvToRgb(hue, 1, 1);
    };


    for (let x = 0; x < 400; x++) {
      for (let y = 0; y < 400; y++) {
        // x & y: coordinates of the pixel
        // scale: granularity of the noise
        // returns a pseudorandom value between -1 - 1
        const value = perlin.perlin2(x / scale, y / scale);
        ctx.fillStyle = getColor(value);
        ctx.fillRect(x, y, 1, 1);
      }
    }

    const buffer = await new Promise<Buffer>((resolve, reject) => {
      canvas.toBuffer((err, buf) => {
        if (err) reject(err);
        else resolve(buf);
      });
    });

    return buffer;
  } catch {
    return 'Error generating image';
  }
}
