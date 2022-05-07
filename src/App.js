import React from "react";
import "./App.css";
import Apod from "./APOD/Apod"

function App() {
  return (
    <div className="App">
      <div className="app-wrapper-content">{<Apod />}</div>
    </div>
  );
}

export default App;
