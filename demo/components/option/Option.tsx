import React from "react";
import './option.css'
import { AnimateTraceBorder } from '../../../src/animate-trace-border';

interface IOptionProp {
  title: string,
  name: string,
  valueType: 'text' | 'number' | 'check',
  placeHolder: string,
  id: string,
  defaultValue?: string | boolean,
  onChangeCB: (name: string, value: string | boolean) => void
}

const Option = ({ title, name, placeHolder, defaultValue, valueType, id, onChangeCB }: IOptionProp) => {

  const numberRegex = /^(0|[1-9]\d*)(\.\d*)?$/;

  const handleChange = (evt: React.ChangeEvent) => {
    const { name, value, checked } = evt.target as HTMLInputElement;
    if (valueType === 'number') {

    }
    if (valueType === 'check') {
      onChangeCB(name, checked);
    } else {
      onChangeCB(name, value);
    }
  }
  console.log('default', defaultValue);
  return (
    <div className="Option">
      <label className="Option-title" htmlFor={id}>{title}</label>
      <AnimateTraceBorder inset trigger={valueType === 'check' ? 'hover' : 'focus'} borderWidth={3}>
        <input
          className={`${'Option-input'}${valueType === 'check' ? ' Option-input-check' : ''}`}
          name={name}
          type={valueType === 'check' ? 'checkbox' : 'text'}
          placeholder={placeHolder}
          value={valueType !== 'check' ? defaultValue?.toString() : ''}
          checked={valueType === 'check' ? !!defaultValue : false}
          onChange={handleChange}
        />

      </AnimateTraceBorder>
    </div>
  )
}

export default Option;