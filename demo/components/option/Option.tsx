import React from "react";
import './option.css'
import { AnimateTraceBorder } from '../../../src/animate-trace-border';

interface IOptionProp {
  title: string,
  valueType: string | number,
  placeHolder: string,
  id: string,
  callback: () => void
}

const Option = ({ title, placeHolder, valueType, id, callback }: IOptionProp) => {

  return (
    <div className="Option-container">
      <label className="Option-title" htmlFor={id}>{title}</label>
      <AnimateTraceBorder inset trigger="focus">
        <input className="Option-input" type="text" placeholder={placeHolder} />
      </AnimateTraceBorder>
    </div>
  )
}

export default Option;