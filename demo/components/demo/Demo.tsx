import React from "react";
import { DemoArea } from "../demo-area";
import { PropOptions } from "../option";
import './demo.css';

const Demo = () => {


  return (
    <div className="Demo">
      <PropOptions />
      <DemoArea />
    </div>
  )

}

export default Demo;