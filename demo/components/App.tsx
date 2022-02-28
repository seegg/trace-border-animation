import React from "react";
import './app.css';
import { Option } from "./option";

const App = () => {

  return (
    <div className="App">
      <Option id="radius" title="Radius" placeHolder="border radius in px" valueType="number" callback={() => { }} />
    </div>
  )

}

export default App;