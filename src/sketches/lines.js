import canvasSketch from "canvas-sketch";
import Random from "canvas-sketch-util/random";
import { linspace } from "canvas-sketch-util/math";

const defaultSeed = "";

Random.setSeed(defaultSeed || Random.getRandomSeed());

const settings = {
  dimensions: [2048, 2048],
};

const pointCount = 40;
const lineCount = 1000;
const frequency = 0.75;
const amplitude = 180;

const sketch = ({ width, height }) => {
  return ({ context }) => {
    const points = linspace(pointCount, true).map((u) => {
      return linspace(lineCount, true).map((v) => {
        const n = Random.noise2D(u * 2, v * 2, frequency, amplitude);
        const x = u * (width / 2) + n + width / 4;
        const y = v * height;

        return [x, y, n];
      });
    });

    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);
    context.lineCap = "round";
    context.lineJoin = "round";

    context.lineWidth = "4";
    context.strokeStyle = "black";

    points.map((line) => {
      line.map(([x, y, n], index) => {
        if (line[index - 1]) {
          context.beginPath();
          context.moveTo(line[index - 1][0], line[index - 1][1]);
          context.lineTo(x, y);
          context.strokeStyle = `hsl(${Math.abs(
            (n / amplitude) * 360
          )}, 80%, ${Math.abs((n / 200) * 100)}%)`;
          context.stroke();
        }
      });
    });
  };
};

canvasSketch(sketch, settings);
