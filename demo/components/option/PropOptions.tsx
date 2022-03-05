import React, { useEffect, useState } from "react";
import { Option } from ".";
import { ITraceBorderProps } from "../../../src/animate-trace-border/";
import { IOptionItems } from "../../type";
import './prop-option.css';
interface IProps {
  optionCallBack: (props: ITraceBorderProps) => void;
}

const PropOptions = ({ optionCallBack }: IProps) => {

  const onChangeCB = handleFormChange;
  //Default option settings
  const [optionItems, setOptionItems] = useState<IOptionItems>(
    {
      borderWidth: {
        id: 'border-width', value: '5', name: 'borderWidth', title: 'Border Width',
        placeHolder: '', valueType: 'number', onChangeCB
      },
      borderRadius: {
        id: 'border-radius', value: '5', name: 'borderRadius', title: 'Border Radius',
        placeHolder: '', valueType: 'number', onChangeCB
      },
      borderColour: {
        id: 'border-colour', value: '#2a5766', name: 'borderColour', title: 'Border Colour',
        placeHolder: 'up to four colours', valueType: 'text', onChangeCB
      },
      animationDuration: {
        id: 'animation-duration', value: '1000', name: 'animationDuration', title: 'Duration',
        placeHolder: 'millisecond', valueType: 'number', onChangeCB
      },
      reverseDuration: {
        id: 'reverse-duration', value: '', name: 'reverseDuration', title: 'Reverse Duration',
        placeHolder: 'millisecond', valueType: 'number', onChangeCB
      },
      speed: {
        id: 'speed', value: '', name: 'speed', title: 'Speed',
        placeHolder: 'px per second', valueType: 'number', onChangeCB
      },
      borderStyle: {
        id: 'border-style', value: 'solid', name: 'borderStyle', title: 'Border Style',
        placeHolder: '', valueType: 'text', onChangeCB
      },
      squareWindow: {
        id: 'squre-window', value: false, name: 'squareWindow', title: 'Square Window',
        placeHolder: '', valueType: 'check', onChangeCB
      },
      inset: {
        id: 'inset', value: true, name: 'inset', title: 'Inset',
        placeHolder: '', valueType: 'check', onChangeCB
      },
      trigger: {
        id: 'triggers', value: 'hover', name: 'trigger', title: 'Trigger',
        placeHolder: 'hover focus', valueType: 'text', onChangeCB
      },
    }
  );

  //convert place holder into proper values.
  const [borderProps, setborderProps] = useState<ITraceBorderProps | null>(null);

  useEffect(() => {
    // map the values in temp prop to borderProps, with default values input is not valid.
    const props: ITraceBorderProps = {};
    for (const item in optionItems) {
      const { value } = optionItems[item];
      let numFallback = 0;
      if (item === 'borderWidth') numFallback = 2;
      if (item === 'animationDuration') numFallback = 2000;
      props[item] =
        optionItems[item as keyof IOptionItems].valueType === 'number' ? Number(value) || numFallback : value;
    }
    setborderProps(props);

  }, [optionItems]);

  //pass the props for border tracing component whenever it updates.
  useEffect(() => {
    optionCallBack(borderProps);
  }, [borderProps]);

  /**
   * call back function for Option component
   * @param name property name for Options Items
   * @param value new value
   */
  function handleFormChange(name: string, value: string | boolean) {
    setOptionItems((items) => ({
      ...items,
      [name]: { ...items[name], value }
    }));

  };

  return (
    <section className="prop-options">
      {/* Manully add in options for consistant ordering */}
      <Option {...optionItems.borderRadius} />
      <Option {...optionItems.borderWidth} />
      <Option {...optionItems.borderColour} />
      <Option {...optionItems.borderStyle} />
      <Option {...optionItems.animationDuration} />
      <Option {...optionItems.reverseDuration} />
      <Option {...optionItems.speed} />
      <Option {...optionItems.trigger} />
      <section className="check-options">
        <Option {...optionItems.squareWindow} />
        <Option {...optionItems.inset} />

      </section>
    </section>
  )

}

export default PropOptions;