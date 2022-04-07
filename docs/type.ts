export interface ITraceBorderProps {
  children?: React.ReactNode,
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

interface IOption {
  id: string,
  value: string | boolean,
  name: string,
  title: string,
  placeHolder: string,
  valueType: 'number' | 'text' | 'check',
  onChangeCB: (name: string, value: string | boolean) => void
};
export interface IOptionItems {
  borderWidth?: IOption,
  borderRadius?: IOption,
  borderColour?: IOption,
  animationDuration?: IOption,
  reverseDuration?: IOption,
  speed?: IOption,
  borderStyle?: IOption,
  squareWindow?: IOption,
  inset?: IOption,
  trigger?: IOption
};