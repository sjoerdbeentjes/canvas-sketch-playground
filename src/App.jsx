import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Sketch from "./routes/sketch.jsx";
import Home from "./routes/home.jsx";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/sketch/:id">
          <Sketch />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}
