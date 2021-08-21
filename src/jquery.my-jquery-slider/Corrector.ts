class Corrector {
  public static makeCorrecterValueTailBy(source: number): (value: number) => number {
    const mantissa = source.toString().split('.')[1];
    const mantissaLength = mantissa ? mantissa.length : 0;
    return (value: number): number => +(value).toFixed(mantissaLength);
  }
}

export default Corrector;
