import React from "react";
import "./App.css";
import Apod from "./APOD/Apod";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="App">
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          className: "",
          error: {
            style: {
              border: "1px solid red",
              color: "white",
              background: 'black',
            },
          },
        }}
      />
      <div className="app-wrapper-content">{<Apod />}</div>
    </div>
  );
}

export default App;
