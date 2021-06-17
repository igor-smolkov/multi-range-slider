interface IScale {
  className: string;
  min: number;
  max: number;
  step: number;
  list: Map<number, string>;
  type: 'basic' | 'numeric' | 'named';
  maxLengthPx: number;
  withIndent: boolean;
  isVertical: boolean;
}
export {IScale};