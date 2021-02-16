import React from "react";
import { useParams } from "react-router";
import canvasSketch from "canvas-sketch";

export default function Sketch() {
  const { id } = useParams();
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    async function getFile() {
      const module = await import(`../sketches/${id}`);
      const { sketch, settings } = module.default;

      canvasSketch(sketch, { ...settings, canvas: canvasRef.current });
    }

    if (canvasRef.current) {
      getFile();
    }
  }, [canvasRef]);

  return <canvas key={id} ref={canvasRef} />;
}
