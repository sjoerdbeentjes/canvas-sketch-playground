// based on https://codesandbox.io/s/yp21r

import Random from "canvas-sketch-util/random";
import { linspace } from "canvas-sketch-util/math";

const defaultSeed = "";

Random.setSeed(defaultSeed || Random.getRandomSeed());

console.log("Random Seed:", Random.getSeed());

const settings = {
  hotkeys: false,
  suffix: Random.getSeed(),
  animate: true,
  duration: 5,
  dimensions: [1000, 1000],
  fps: 30,
};

const sketch = ({ width, height }) => {
  const pageSize = Math.min(width, height);

  const margin = 0;
  const gridSize = 50;
  const background = "black";
  const strokeHue = Random.range(0, 360); 

  const length = pageSize * 0.1;
  const lineWidth = pageSize * 0.00175;
  const frequency = 0.75;
  const amplitude = 1.5;
  const alpha = 1;

  const cells = linspace(gridSize, true)
    .map((v) => {
      return linspace(gridSize, true).map((u) => {
        return [u, v];
      });
    })
    .flat();

  return ({ context, playhead }) => {
    context.fillStyle = background;
    context.globalAlpha = 1;
    context.fillRect(0, 0, width, height);

    const innerSize = pageSize - margin * 1;
    cells.forEach((cell) => {
      const [u, v] = cell;

      let x = u * innerSize;
      let y = v * innerSize;

      x += (width - innerSize) / 2;
      y += (height - innerSize) / 2;

      const n = Random.noise2D(u * 2, v * 2, frequency, amplitude);
      const angle = Math.PI * playhead + n * 5;

      context.globalAlpha = alpha;
      context.strokeStyle =
        n < 0.1
          ? "transparent"
          : `hsl(${strokeHue}, 10%, ${n * (100 / amplitude)}%)`;

      segment(context, x, y, angle, length, lineWidth);
    });
  };
};

function segment(context, x, y, angle = 0, length = 1, lineWidth = 1) {
  const halfLength = length / 2;
  const u = Math.cos(angle) * halfLength;
  const v = Math.sin(angle) * halfLength;

  context.beginPath();
  context.moveTo(x - u, y - v);
  context.lineTo(x + u, y + v);
  context.lineWidth = lineWidth;
  context.stroke();
}

export default { sketch, settings };