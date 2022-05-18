import React from "react";
import "./App.css";
import Apod from "./APOD/Apod";
import { Toaster } from "react-hot-toast";
import Stars from "./features/stars/Stars";

function App() {
  return (
    <div className="App">
      <Stars/>
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
