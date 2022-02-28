import React from "react";
import { Option } from ".";
import './prop-option.css';

const PropOptions = () => {


  return (
    <div>
      <Option id="border-radius" name="borderRadius" title="Border Radius" placeHolder="" valueType="number" onChangeCB={() => { }} />
      <Option id="border-width" name="borderWidth" title="Border Width" placeHolder="" valueType="number" onChangeCB={() => { }} />
      <Option id="border-colour" name="borderColour" title="Border Colour" placeHolder="" valueType="number" onChangeCB={() => { }} />
      <Option id="border-style" name="borderStyle" title="Border Style" placeHolder="" valueType="number" onChangeCB={() => { }} />
      <Option id="animation-duration" name="animationDuration" title="Duration" placeHolder="overritten by speed" valueType="number" onChangeCB={() => { }} />
      <Option id="speed" name="speed" title="Border Radius" placeHolder="px per second" valueType="number" onChangeCB={() => { }} />
      <Option id="square-window" name="squareWindow" title="Square Window" placeHolder="inner border is square" valueType="check" onChangeCB={() => { }} />
      <Option id="inset" name="inset" title="Inset" placeHolder="" valueType="check" onChangeCB={() => { }} />
      <Option id="trigger" name="trigger" title="Triggers" placeHolder="hover focus" valueType="text" onChangeCB={() => { }} />
    </div>
  )

}

export default PropOptions;