import React from "react";
import "./App.css";
import Apod from "./APOD/Apod";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="App">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="app-wrapper-content">{<Apod />}</div>
    </div>
  );
}

export default App;
