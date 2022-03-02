import React, { useEffect, useState } from "react";
import { Option } from ".";
import { ITraceBorderProps } from "../../../src/animate-trace-border/AnimationTraceBorder";
import { IOptionItems } from "../../type";
import './prop-option.css';


interface TempProp {
  borderWidth?: string,
  borderRadius?: string,
  borderColour?: string,
  animationDuration?: string,
  reverseDuration?: string,
  speed?: string,
  borderStyle?: string,
  squareWindow?: boolean,
  inset?: boolean,
  trigger?: string
};

interface IProps {
  optionCallBack: (props: ITraceBorderProps) => void;
}

const PropOptions = ({ optionCallBack }: IProps) => {

  //String values used for displaying incomplete float numbers
  const [placeHolderProp, setPlaceHolderProp] = useState<TempProp>(
    {
      borderWidth: '5',
      borderRadius: '5',
      borderColour: '#2a5766',
      animationDuration: '1000',
      reverseDuration: '1000',
      speed: '',
      borderStyle: 'solid',
      squareWindow: false,
      inset: true,
      trigger: 'hover'
    }
  );

  //Default option settings
  const [optionItems, setOptionItems] = useState<IOptionItems>(
    {
      borderWidth: { id: 'border-width', value: '5', name: 'borderWidth', title: 'Border Width', placeHolder: '', valueType: 'number', onChangeCB: handleFormChange },
      borderRadius: { id: 'border-radius', value: '5', name: 'borderRadius', title: 'Border Radius', placeHolder: '', valueType: 'number', onChangeCB: handleFormChange },
      borderColour: { id: 'border-colour', value: '#2a5766', name: 'borderColour', title: 'Border Colour', placeHolder: 'up to four colours', valueType: 'text', onChangeCB: handleFormChange },
      animationDuration: { id: 'animation-duration', value: '1000', name: 'animationDuration', title: 'Duration', placeHolder: 'millisecond', valueType: 'number', onChangeCB: handleFormChange },
      reverseDuration: { id: 'reverse-duration', value: '1000', name: 'reverseDuration', title: 'Reverse Duration', placeHolder: 'millisecond', valueType: 'number', onChangeCB: handleFormChange },
      speed: { id: 'speed', value: '', name: 'speed', title: 'Speed', placeHolder: 'px per second', valueType: 'number', onChangeCB: handleFormChange },
      borderStyle: { id: 'border-style', value: 'solid', name: 'borderStyle', title: 'Border Style', placeHolder: '', valueType: 'text', onChangeCB: handleFormChange },
      squareWindow: { id: 'squre-window', value: false, name: 'squareWindow', title: 'Square Window', placeHolder: '', valueType: 'check', onChangeCB: handleFormChange },
      inset: { id: 'inset', value: true, name: 'inset', title: 'Inset', placeHolder: '', valueType: 'check', onChangeCB: handleFormChange },
      trigger: { id: 'triggers', value: 'hover', name: 'trigger', title: 'Trigger', placeHolder: 'hover focus', valueType: 'text', onChangeCB: handleFormChange },
    }
  );

  //convert place holder into proper values.
  const [finalProp, setFinalProp] = useState<ITraceBorderProps | null>(null);

  useEffect(() => {
    //map the values in temp prop to finalProp, with default values input is not valid.
    const temp: ITraceBorderProps = {
      ...placeHolderProp,
      borderWidth: Number(placeHolderProp.borderWidth) || 2,
      borderRadius: Number(placeHolderProp.borderRadius) || 0,
      ...(placeHolderProp.animationDuration && { animationDuration: Number(placeHolderProp.animationDuration) || 500, }),
      ...(placeHolderProp.reverseDuration && { reverseDuration: Number(placeHolderProp.reverseDuration) }),
      speed: Number(placeHolderProp.speed) || 0,
    };

    setFinalProp(temp);

  }, [placeHolderProp]);

  //pass the finalProp object to parent component whenever it updates.
  useEffect(() => {
    optionCallBack(finalProp);
  }, [finalProp]);

  function handleFormChange(name: string, value: string | boolean) {
    setPlaceHolderProp({
      ...placeHolderProp,
      [name]: value
    })
  };

  return (
    <div className="prop-options">
      <Option id="border-radius" name="borderRadius" title="Border Radius" value={placeHolderProp.borderRadius} placeHolder="" valueType="number" onChangeCB={handleFormChange} />
      <Option id="border-width" name="borderWidth" title="Border Width" value={placeHolderProp.borderWidth} placeHolder="" valueType="number" onChangeCB={handleFormChange} />
      <Option id="border-colour" name="borderColour" title="Border Colour" value={placeHolderProp.borderColour} placeHolder="" valueType="text" onChangeCB={handleFormChange} />
      <Option id="border-style" name="borderStyle" title="Border Style" value={placeHolderProp.borderStyle} placeHolder="" valueType="text" onChangeCB={handleFormChange} />
      <Option id="animation-duration" name="animationDuration" title="Duration" value={placeHolderProp.animationDuration} placeHolder="overritten by speed" valueType="number" onChangeCB={handleFormChange} />
      <Option id="reverse-duration" name="reverseDuration" title="Reverse Duration" value={placeHolderProp.reverseDuration} placeHolder="overritten by speed" valueType="number" onChangeCB={handleFormChange} />
      <Option id="speed" name="speed" title="Speed" value={placeHolderProp.speed} placeHolder="px per second" valueType="number" onChangeCB={handleFormChange} />
      <Option id="trigger" name="trigger" title="Triggers" value={placeHolderProp.trigger} placeHolder="hover focus" valueType="text" onChangeCB={handleFormChange} />
      <Option id="square-window" name="squareWindow" title="Square Window" value={placeHolderProp.squareWindow} placeHolder="inner border is square" valueType="check" onChangeCB={handleFormChange} />
      <Option id="inset" name="inset" title="Inset" value={placeHolderProp.inset} placeHolder="" valueType="check" onChangeCB={handleFormChange} />
    </div>
  )

}

export default PropOptions;