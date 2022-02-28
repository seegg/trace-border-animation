import React from "react";
import './option.css'
import { AnimateTraceBorder } from '../../../src/animate-trace-border';

interface IOptionProp {
  title: string,
  name: string,
  valueType: string | number,
  placeHolder: string,
  id: string,
  defaultValue?: string | boolean,
  onChangeCB: () => void
}

const Option = ({ title, name, placeHolder, valueType, id, onChangeCB }: IOptionProp) => {

  const handleChange = (evt: React.ChangeEvent) => {
    evt.preventDefault();
  }
  console.log(valueType);
  return (
    <div className="Option">
      <label className="Option-title" htmlFor={id}>{title}</label>
      <AnimateTraceBorder inset trigger={valueType === 'check' ? 'hover' : 'focus'} borderWidth={3}>
        <input
          className={`${'Option-input'}${valueType === 'check' ? ' Option-input-check' : ''}`}
          name={name}
          type={valueType === 'check' ? 'checkbox' : 'text'}
          placeholder={placeHolder}
          onChange={handleChange}
        />

      </AnimateTraceBorder>
    </div>
  )
}

export default Option;