import React from "react";
import './app.css';
import { Demo } from "./demo";
import { Header } from "./header";

const App = () => {

  return (
    <div className="App">
      <div>
        <Header />
        <Demo />
      </div>
    </div>
  )

}

export default App; 