import React from "react";
import { Link } from "react-router-dom";
const files = require.context("../sketches/", true, /\.js$/);

export default function Home() {
  return (
    <ul>
      {files.keys().map((file) => {
        const name = file.split(".js")[0].replace("./", "");

        return (
          <li key={file}>
            <Link to={`/sketch/${name}`}>{name}</Link>
          </li>
        );
      })}
    </ul>
  );
}
