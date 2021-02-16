import canvasSketch from "canvas-sketch";
import Random from "canvas-sketch-util/random";
import { linspace } from "canvas-sketch-util/math";

// You can force a specific seed by replacing this with a string value
const defaultSeed = "";

// Set a random seed so we can reproduce this print later
Random.setSeed(defaultSeed || Random.getRandomSeed());

// Print to console so we can see which seed is being used and copy it if desired
console.log("Random Seed:", Random.getSeed());

function perc2color(perc) {
  var r,
    g,
    b = 0;
  if (perc < 50) {
    r = 255;
    g = Math.round(5.1 * perc);
  } else {
    g = 255;
    r = Math.round(510 - 5.1 * perc);
  }
  var h = r * 0x10000 + g * 0x100 + b * 0x1;
  return "#" + ("000000" + h.toString(16)).slice(-6);
}

const settings = {
  hotkeys: false,
  suffix: Random.getSeed(),
  dimensions: [1000, 1000],
};

const sketch = ({ width, height }) => {
  const pageSize = Math.min(width, height);

  // page settings
  const margin = 0;
  const gridSize = 50;
  const background = "black";

  // segment settings
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

      const n = Random.noise2D(u * 2, v * 2, frequency);
      const size = Math.abs(n) * 15;

      // scale to inner size
      let x = u * innerSize;
      let y = v * innerSize;

      // center on page
      x += (width - innerSize) / 2;
      y += (height - innerSize) / 2;

      // draw cell
      context.globalAlpha = alpha;
      context.strokeStyle = "white";
      context.fillStyle = "white";
      context.fill();

      dot(context, x, y, size);
    });
  };
};

function dot(context, x, y, size) {
  context.beginPath();
  context.arc(x, y, size, 0, 2 * Math.PI, true);
  context.stroke();
}

export default { sketch, settings };
