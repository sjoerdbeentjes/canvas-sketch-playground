import canvasSketch from "canvas-sketch";
import Random from "canvas-sketch-util/random";
import { linspace } from "canvas-sketch-util/math";

// You can force a specific seed by replacing this with a string value
const defaultSeed = "";

// Set a random seed so we can reproduce this print later
Random.setSeed(defaultSeed || Random.getRandomSeed());

// Print to console so we can see which seed is being used and copy it if desired
console.log("Random Seed:", Random.getSeed());

const settings = {
  hotkeys: false,
  suffix: Random.getSeed(),
  dimensions: [2000, 2000],
};

const sketch = ({ width, height }) => {
  const pageSize = Math.min(width, height);

  const margin = 0;
  const gridSize = 10;
  const background = "black";
  const circleSize = width / gridSize;
  const lineWidth = 10;
  const frequency = 0.75;
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

      const n = Random.noise2D(x, y, frequency);

      context.globalAlpha = alpha;
      context.fillStyle = "transparent";
      context.lineWidth = lineWidth;
      context.fill();

      context.strokeStyle = "white";
      circle(context, x, y, circleSize, playhead);
    });
  };
};

function circle(context, x, y, size) {
  context.beginPath();
  context.arc(x, y, size, 0, 2 * Math.PI);
  context.stroke();
}

export default { sketch, settings };
