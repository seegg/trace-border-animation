import React, { useEffect, useState } from "react";
import { Option } from ".";
import './prop-option.css';


interface TempProp {
  borderWidth?: string,
  borderRadius?: string,
  borderColour?: string,
  animationDuration?: string,
  speed?: string,
  borderStyle?: string,
  squreWindow?: boolean,
  inset?: boolean,
  trigger?: string

}
interface FinalProp {
  borderWidth?: number,
  borderRadius?: number,
  borderColour?: string,
  animationDuration?: number,
  speed?: number,
  borderStyle?: string,
  squreWindow?: boolean,
  inset?: boolean,
  trigger?: string

}

const PropOptions = () => {

  const [placeHolderProp, setPlaceHolderProp] = useState<TempProp>(
    {
      borderWidth: '5',
      borderRadius: '5',
      borderColour: '#2a5766',
      animationDuration: '1000',
      speed: '',
      borderStyle: 'solid',
      squreWindow: false,
      inset: true,
      trigger: 'hover'
    }
  );

  const [finalProp, setFinalProp] = useState<FinalProp>(
    {
      borderWidth: 5,
      borderRadius: 5,
      borderColour: '#2a5766',
      animationDuration: 1000,
      borderStyle: 'solid',
      squreWindow: false,
      inset: true,
      trigger: 'hover'
    }
  );

  useEffect(() => {
    console.log('stuff');
  })

  const handleFormChange = (name: string, value: string | boolean) => {
    console.log(value);
    setPlaceHolderProp({
      ...placeHolderProp,
      [name]: value
    })
  };

  return (
    <div className="prop-options">
      <div className="prop-options-item">
        <Option id="border-radius" name="borderRadius" title="Border Radius" defaultValue={placeHolderProp.borderRadius} placeHolder="" valueType="number" onChangeCB={handleFormChange} />
      </div>
      <div className="prop-options-item">
        <Option id="border-width" name="borderWidth" title="Border Width" defaultValue={placeHolderProp.borderWidth} placeHolder="" valueType="number" onChangeCB={handleFormChange} />
      </div>
      <div className="prop-options-item">
        <Option id="border-colour" name="borderColour" title="Border Colour" defaultValue={placeHolderProp.borderColour} placeHolder="" valueType="number" onChangeCB={handleFormChange} />
      </div>
      <div className="prop-options-item">
        <Option id="border-style" name="borderStyle" title="Border Style" defaultValue={placeHolderProp.borderStyle} placeHolder="" valueType="number" onChangeCB={handleFormChange} />
      </div>
      <div className="prop-options-item">
        <Option id="animation-duration" name="animationDuration" title="Duration" defaultValue={placeHolderProp.animationDuration} placeHolder="overritten by speed" valueType="number" onChangeCB={handleFormChange} />
      </div>
      <div className="prop-options-item">
        <Option id="speed" name="speed" title="Speed" defaultValue={placeHolderProp.speed} placeHolder="px per second" valueType="number" onChangeCB={handleFormChange} />
      </div>
      <div className="prop-options-item">
        <Option id="square-window" name="squareWindow" title="Square Window" defaultValue={placeHolderProp.squreWindow} placeHolder="inner border is square" valueType="check" onChangeCB={handleFormChange} />
      </div>
      <div className="prop-options-item">
        <Option id="inset" name="inset" title="Inset" defaultValue={placeHolderProp.inset} placeHolder="" valueType="check" onChangeCB={handleFormChange} />
      </div>
      <div className="prop-options-item">
        <Option id="trigger" name="trigger" title="Triggers" defaultValue={placeHolderProp.trigger} placeHolder="hover focus" valueType="text" onChangeCB={handleFormChange} />
      </div>
    </div>
  )

}

export default PropOptions;