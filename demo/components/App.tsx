import React from "react";
import './app.css';
import { Demo } from "./demo";
import { Header } from "./header";
import { circleUtils } from "../../src/animate-trace-border/util";

const App = () => {



  const handleClick = () => {
    try {

      const input = (document.getElementById('input') as HTMLInputElement).value.split(' ');
      const p1 = input[0].split(',');
      const p2 = input[1].split(',');
      const circ = input[2].split(',');
      //@ts-ignore
      console.log(circleUtils.circleLineIntersect({ x: p1[0], y: p1[1] }, { x: p2[0], y: p2[1] }, { x: circ[0], y: circ[1], r: circ[2] }))
    } catch (err) {

    }
  }

  const handleClick2 = () => {
    try {

      const input = (document.getElementById('input2') as HTMLInputElement).value.split(' ');
      const p1 = input[0].split(',');
      const p2 = input[1].split(',');
      //@ts-ignore
      console.log(circleUtils().distanceBetween2Points({ x: p1[0], y: p1[1] }, { x: p2[0], y: p2[1] }));
    } catch (err) {

    }
  }

  return (
    <div className="App">
      <div>
        <Header />
        <Demo />
      </div>

      {/* <div>
        <input type="text" id='input' />
        <button onClick={handleClick}>calc</button>
      </div>
      <div>
        <input type="text" id='input2' />
        <button onClick={handleClick2}>calc</button>
      </div> */}
    </div>
  )

}

export default App; 