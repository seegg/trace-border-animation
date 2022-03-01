import React, { useEffect, useState } from "react";
import { Option } from ".";
import { ITraceBorderProps } from "../../type";
import './prop-option.css';


interface TempProp {
  borderWidth?: string,
  borderRadius?: string,
  borderColour?: string,
  animationDuration?: string,
  speed?: string,
  borderStyle?: string,
  squareWindow?: boolean,
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
  squareWindow?: boolean,
  inset?: boolean,
  trigger?: string

}

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
      speed: '',
      borderStyle: 'solid',
      squareWindow: false,
      inset: true,
      trigger: 'hover'
    }
  );

  //convert place holder into proper values.
  const [finalProp, setFinalProp] = useState<ITraceBorderProps>(
    {
      borderWidth: 5,
      borderRadius: 5,
      borderColour: '#2a5766',
      animationDuration: 1000,
      speed: 0,
      borderStyle: 'solid',
      squareWindow: false,
      inset: true,
      trigger: 'hover'
    }
  );

  useEffect(() => {
    //map the values in temp prop to finalProp, with default values input is not valid.
    const temp: ITraceBorderProps = {
      ...placeHolderProp,
      borderWidth: Number(placeHolderProp.borderWidth) || 2,
      borderRadius: Number(placeHolderProp.borderRadius) || 0,
      ...(placeHolderProp.animationDuration && { animationDuration: Number(placeHolderProp.animationDuration) || 500, }),
      speed: Number(placeHolderProp.speed) || 0,
    };

    setFinalProp(temp);

  }, [placeHolderProp]);

  //pass the finalProp object to parent component whenever it updates.
  useEffect(() => {
    optionCallBack(finalProp);
  }, [finalProp]);

  const handleFormChange = (name: string, value: string | boolean) => {
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
        <Option id="border-colour" name="borderColour" title="Border Colour" defaultValue={placeHolderProp.borderColour} placeHolder="" valueType="text" onChangeCB={handleFormChange} />
      </div>
      <div className="prop-options-item">
        <Option id="border-style" name="borderStyle" title="Border Style" defaultValue={placeHolderProp.borderStyle} placeHolder="" valueType="text" onChangeCB={handleFormChange} />
      </div>
      <div className="prop-options-item">
        <Option id="animation-duration" name="animationDuration" title="Duration" defaultValue={placeHolderProp.animationDuration} placeHolder="overritten by speed" valueType="number" onChangeCB={handleFormChange} />
      </div>
      <div className="prop-options-item">
        <Option id="speed" name="speed" title="Speed" defaultValue={placeHolderProp.speed} placeHolder="px per second" valueType="number" onChangeCB={handleFormChange} />
      </div>
      <div className="prop-options-item">
        <Option id="trigger" name="trigger" title="Triggers" defaultValue={placeHolderProp.trigger} placeHolder="hover focus" valueType="text" onChangeCB={handleFormChange} />
      </div>
      <div className="prop-options-item">
        <Option id="square-window" name="squareWindow" title="Square Window" defaultValue={placeHolderProp.squareWindow} placeHolder="inner border is square" valueType="check" onChangeCB={handleFormChange} />
      </div>
      <div className="prop-options-item">
        <Option id="inset" name="inset" title="Inset" defaultValue={placeHolderProp.inset} placeHolder="" valueType="check" onChangeCB={handleFormChange} />
      </div>

    </div>
  )

}

export default PropOptions;