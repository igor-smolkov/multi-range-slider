type TRange = {
  min: number;
  max: number;
  current?: number;
};

interface IRange {
  setMin(min: number): number;
  getMin(): number;
  setMax(max: number): number;
  getMax(): number;
  setCurrent(current: number): number;
  getCurrent(): number;
}

class Range implements IRange {
  private max = 100;

  private min = 0;

  private current = 50;

  constructor(options: TRange = { max: 100, min: 0, current: 50 }) {
    this.configure(options);
  }

  public setMin(min: number): number {
    this.setRange(min, this.getMax());
    return this.getMin();
  }

  public getMin(): number {
    return this.min;
  }

  public setMax(max: number): number {
    this.setRange(this.getMin(), max);
    return this.getMax();
  }

  public getMax(): number {
    return this.max;
  }

  public setCurrent(current: number): number {
    const isValid = this.getMin() <= current
      && current <= this.getMax();
    if (isValid) {
      this.current = current;
    } else if (current <= this.getMin()) {
      this.current = this.getMin();
    } else {
      this.current = this.getMax();
    }
    return this.getCurrent();
  }

  public getCurrent(): number {
    return this.current;
  }

  private configure(options: TRange) {
    const config = { ...options };
    this.min = Range.isCorrectRange(config.min, config.max)
      ? config.min
      : config.max;
    this.max = config.max;
    this.current = config.current || config.current === 0
      ? this.setCurrent(config.current) : this.setCurrent(this.max);
  }

  private static isCorrectRange(min: number, max: number) {
    return min <= max;
  }

  private setRange(min: number, max: number) {
    this.min = Range.isCorrectRange(min, max) ? min : this.min;
    this.max = Range.isCorrectRange(this.min, max)
      ? max
      : this.max;
    this.setCurrent(this.getCurrent());
    return this.getCurrent();
  }
}

export { Range, TRange, IRange };
