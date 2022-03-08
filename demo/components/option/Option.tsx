import React, { useEffect, useRef, useState } from "react";
import './option.css'
import { AnimateTraceBorder } from '../../../src/animate-trace-border';

interface IOptionProp {
  title: string,
  name: string,
  valueType: 'text' | 'number' | 'check',
  placeHolder: string,
  id: string,
  value?: string | boolean,
  onChangeCB: (name: string, value: string | boolean) => void
}

const Option = ({ title, name, placeHolder, value, valueType, id, onChangeCB }: IOptionProp) => {


  const handleChange = (evt: React.ChangeEvent) => {
    const { name, value, checked } = evt.target as HTMLInputElement;

    if (valueType === 'number') {
      //test to see if it's a number empty string or string with a dot at the end.
      if (!/^(^$|0|[1-9]\d*)(\.\d*)?$/.test(value)) return;
    }

    if (valueType === 'check') {
      onChangeCB(name, checked);
    } else {
      onChangeCB(name, value);
    }
  };

  return (
    <section className="Option">
      <label className="Option-title" htmlFor={id}>{title}</label>
      <AnimateTraceBorder
        inset
        trigger={valueType === 'check' ? 'hover' : 'focus'}
        borderWidth={2}
        animationDuration={500}
        borderRadius={5}
        traceOnRerender
        borderColour="darkRed"
      >
        <input
          className={`${'Option-input'}${valueType === 'check' ? ' Option-input-check' : ''}`}
          name={name}
          type={valueType === 'check' ? 'checkbox' : 'text'}
          placeholder={placeHolder}
          value={valueType !== 'check' ? value?.toString() : ''}
          checked={valueType === 'check' ? value as boolean : false}
          onChange={handleChange}
        />

      </AnimateTraceBorder>
    </section>
  )
}

export default Option;