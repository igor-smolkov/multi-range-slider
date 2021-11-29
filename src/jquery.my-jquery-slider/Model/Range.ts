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
  private _max = 100;

  private _min = 0;

  private _current = 50;

  constructor(options: TRange = { max: 100, min: 0, current: 50 }) {
    this._configure(options);
  }

  public setMin(min: number): number {
    this._setRange(min, this.getMax());
    return this.getMin();
  }

  public getMin(): number {
    return this._min;
  }

  public setMax(max: number): number {
    this._setRange(this.getMin(), max);
    return this.getMax();
  }

  public getMax(): number {
    return this._max;
  }

  public setCurrent(current: number): number {
    const isValid = this.getMin() <= current
      && current <= this.getMax();
    if (isValid) {
      this._current = current;
    } else if (current <= this.getMin()) {
      this._current = this.getMin();
    } else {
      this._current = this.getMax();
    }
    return this.getCurrent();
  }

  public getCurrent(): number {
    return this._current;
  }

  private _configure(options: TRange) {
    const config = { ...options };
    this._min = Range._isCorrectRange(config.min, config.max)
      ? config.min
      : config.max;
    this._max = config.max;
    this._current = config.current || config.current === 0
      ? this.setCurrent(config.current) : this.setCurrent(this._max);
  }

  private static _isCorrectRange(min: number, max: number) {
    return min <= max;
  }

  private _setRange(min: number, max: number) {
    this._min = Range._isCorrectRange(min, max) ? min : this._min;
    this._max = Range._isCorrectRange(this._min, max)
      ? max
      : this._max;
    this.setCurrent(this.getCurrent());
    return this.getCurrent();
  }
}

export { Range, TRange, IRange };
