import React from "react";
import { useParams } from "react-router";
import canvasSketch from "canvas-sketch";

const containerStyles = {
  width: "100vw",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row",
  margin: "0",
};

const canvasStyles = {
  margin: "auto",
  display: "block",
  boxShadow: "0px 2px 12px -2px rgb(0 0 0 / 15%)",
};

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

  return (
    <div style={containerStyles}>
      <canvas key={id} ref={canvasRef} style={canvasStyles} />
    </div>
  );
}
