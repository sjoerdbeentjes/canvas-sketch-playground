const canvasSketch = require("canvas-sketch");
const Random = require("canvas-sketch-util/random");
const { linspace } = require("canvas-sketch-util/math");

// You can force a specific seed by replacing this with a string value
const defaultSeed = "";

// Set a random seed so we can reproduce this print later
Random.setSeed(defaultSeed || Random.getRandomSeed());

// Print to console so we can see which seed is being used and copy it if desired
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

  // page settings
  const margin = 0;
  const gridSize = 50;
  const background = "black";

  // segment settings
  const length = pageSize * 0.1;
  const lineWidth = pageSize * 0.00175;
  const frequency = 0.75;
  const alpha = 1;

  // Create some flat data structure worth of points
  const cells = linspace(gridSize, true)
    .map((v) => {
      return linspace(gridSize, true).map((u) => {
        return [u, v];
      });
    })
    .flat();

  return ({ context, frame, playhead }) => {
    // Fill the canvas
    context.fillStyle = background;
    context.globalAlpha = 1;
    context.fillRect(0, 0, width, height);

    // draw grid
    const innerSize = pageSize - margin * 1;
    cells.forEach((cell) => {
      const [u, v] = cell;

      // scale to inner size
      let x = u * innerSize;
      let y = v * innerSize;

      // center on page
      x += (width - innerSize) / 2;
      y += (height - innerSize) / 2;

      // get a random angle from noise
      const n = Random.noise2D(u * 2 - 1, v * 2 - 1, frequency);
      // const angle = n * Math.PI * 2;
      const angle = Math.PI * playhead + n * 5;

      // draw cell
      context.globalAlpha = alpha;
      context.strokeStyle =
        n < 0.1 ? "transparent" : `hsl(${n * 100}, ${n * 100}%, ${n * 100}%)`;

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

canvasSketch(sketch, settings);
