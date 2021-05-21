interface IScale {
  min: number;
  max: number;
  step: number;
  list: Map<number, string>;
  sign: string;
  maxLengthPx: number;
  indent: boolean;
}
export default IScale;