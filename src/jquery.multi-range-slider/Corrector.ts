class Corrector {
  public static makeCorrecterValueTailBy(
    ...sources: number[]
  ): (value: number) => number {
    const maxLength = Corrector.getMaxMantissaLength(...sources);
    return (value: number): number => Corrector.correctValueTail(value, maxLength);
  }

  public static getMaxMantissaLength(...sources: number[]): number {
    const lengths: number[] = [];
    sources.forEach((source) => {
      if (Corrector.getMantissa(source)) {
        lengths.push(Corrector.getMantissa(source).length);
      }
    });
    return lengths.length ? Math.max(...lengths) : 0;
  }

  public static correctValueTail(value: number, length: number): number {
    return +value.toFixed(length);
  }

  public static getMantissa(number: number): string {
    return number.toString().split('.')[1];
  }
}

export default Corrector;
