import Corrector from '../Corrector';
import { IRange } from './Range';

type TSlider = {
  min?: number;
  max?: number;
  active?: number;
  step?: number;
  value?: number;
  minInterval?: number;
  maxInterval?: number;
  actualRanges?: number[];
};

interface ISlider {
  update(options: TSlider): void;
  getMin(): number;
  setMin(limit: number): number;
  getMax(): number;
  setMax(limit: number): number;
  getValue(): number;
  setValue(value: number): number;
  setPerValue(perValue: number): number;
  getStep(): number;
  getMinInterval(): number;
  getMaxInterval(): number;
  getActualRanges(): number[] | null;
  getActive(): number;
  setActive(active: number): number;
  setActiveCloseOfValue(value: number): number;
  getValues(): number[];
  getPerValues(): number[];
  getLimits(): number[];
  isDouble(): boolean;
  getAbsoluteRange(): number;
  stepForward(): void;
  stepBackward(): void;
}

class Slider implements ISlider {
  private _ranges: IRange[];

  private _active = 0;

  private _step = 1;

  private _actualRanges: number[] | null = null;

  constructor(ranges: IRange[], options?: TSlider) {
    this._ranges = Slider._correctRanges(ranges);
    this._configure(options);
  }

  public update(options: TSlider): void {
    this._configure(options);
  }

  public setMin(limit: number): number {
    if (!this._ranges.find((range) => limit <= range.getMax())) {
      return this._ranges[0].getMin();
    }
    this._ranges[0].setMin(limit);
    let cutIndex = 0;
    this._ranges.forEach((range, index) => {
      if (limit > range.getMin()) {
        range.setMin(limit);
      }
      if (limit > range.getMax()) {
        cutIndex = index + 1;
      }
    });
    this._ranges.splice(0, cutIndex);
    return this._ranges[0].getMin();
  }

  public getMin(): number {
    return this._ranges[0].getMin();
  }

  public setMax(limit: number): number {
    if (!this._ranges.find((range) => limit >= range.getMin())) {
      return this._ranges[0].getMax();
    }
    this._ranges[this._ranges.length - 1].setMax(limit);
    let cutIndex = 0;
    const ranges = this._ranges.slice().reverse();
    ranges.forEach((range, index) => {
      if (limit < range.getMax()) {
        range.setMax(limit);
      }
      if (limit < range.getMin()) {
        cutIndex = index + 1;
      }
    });
    ranges.splice(0, cutIndex);
    this._ranges = ranges.slice().reverse();
    return this._ranges[this._ranges.length - 1].getMax();
  }

  public getMax(): number {
    return this._ranges[this._ranges.length - 1].getMax();
  }

  public setValue(value: number): number {
    return this._setValueByIndex(value, this._active);
  }

  public getValue(): number {
    return this._ranges[this._active].getCurrent();
  }

  public setPerValue(perValue: number): number {
    const newValue = (perValue * this.getAbsoluteRange())
      / 100 + this.getMin();
    return this.setValue(newValue);
  }

  public setStep(step?: number): number {
    const isValid = step && step > 0;
    this._step = isValid ? step as number : 1;
    return this.getStep();
  }

  public getStep(): number {
    return this._step;
  }

  public setMinInterval(value: number): number {
    if (value <= this._ranges[0].getMax()) {
      return this._setValueByIndex(value, 0);
    }
    this._ranges.forEach((range, index) => {
      if (value > this.getMax()) {
        range.setMax(this.getMax());
      }
      const isRangeOffset = value > range.getMax()
        && value < this.getMax();
      if (isRangeOffset) {
        range.setMax(value);
      }
      if (value > range.getCurrent()) {
        this._setValueByIndex(value, index);
      }
    });
    return this.getMinInterval();
  }

  public getMinInterval(): number {
    return this._ranges[0].getCurrent();
  }

  public setMaxInterval(value: number): number {
    if (value >= this._ranges[this._ranges.length - 1].getMin()) {
      return this._setValueByIndex(value, this._ranges.length - 1);
    }
    const ranges = this._ranges.slice().reverse();
    ranges.forEach((range, index) => {
      if (value < this.getMin()) {
        range.setMin(this.getMin());
      }
      const isRangeOffset = value < range.getMin()
        && value > this.getMin();
      if (isRangeOffset) {
        range.setMin(value);
      }
      if (value < range.getCurrent()) {
        range.setCurrent(
          this._setValueByIndex(
            value,
            this._ranges.length - 1 - index,
          ),
        );
      }
    });
    this._ranges = ranges.slice().reverse();
    return this.getMaxInterval();
  }

  public getMaxInterval(): number {
    return this._ranges[this._ranges.length - 1].getCurrent();
  }

  public setActive(active?: number): number {
    this._active = this._isCorrectIndex(active as number)
      ? active as number
      : this._active ?? 0;
    return this._active;
  }

  public getActive(): number {
    return this._active;
  }

  public setActiveCloseOfValue(value: number): number {
    const index = this._getIndexCloseOfValue(value);
    return this.setActive(index);
  }

  public isDouble(): boolean {
    return this._ranges.length === 2;
  }

  public getLimits(): number[] {
    const limits: number[] = [];
    this._ranges.forEach((range, index) => {
      if (index === 0) {
        limits.push(range.getMin());
      }
      limits.push(range.getCurrent());
      if (index === this._ranges.length - 1) {
        limits.push(range.getMax());
      }
    });
    return limits;
  }

  public getValues(): number[] {
    return this._ranges.map((r) => r.getCurrent());
  }

  public getPerValues(): number[] {
    const perValues: number[] = [];
    this._ranges.forEach((_, index) => {
      perValues.push(this._getPerValueByIndex(index));
    });
    return perValues;
  }

  public setActualRanges(actualRanges?: number[]): number[] | null {
    const isDefault = !this._actualRanges || actualRanges === null;
    if (isDefault) {
      this._actualRanges = Slider._defineActualRanges(
        this._ranges.length,
      );
    }
    const isOff = actualRanges && !actualRanges.length;
    if (isOff) {
      this._actualRanges = [];
      return this._actualRanges;
    }
    if (!actualRanges) return this._actualRanges;
    const newActualRanges: number[] = [];
    actualRanges.forEach((actual) => {
      if (this._isCorrectIndex(actual)) {
        newActualRanges.push(actual);
      }
    });
    this._actualRanges = newActualRanges.length
      ? newActualRanges
      : this._actualRanges;
    return this.getActualRanges();
  }

  public getActualRanges(): number[] | null {
    return this._actualRanges;
  }

  public getAbsoluteRange(): number {
    return this.getMax() - this.getMin();
  }

  public stepForward(): void {
    this.setValue(this.getValue() + this.getStep());
  }

  public stepBackward(): void {
    this.setValue(this.getValue() - this.getStep());
  }

  private static _correctRanges(ranges: IRange[]) {
    const validRanges: IRange[] = [];
    Slider._sortRanges(ranges).forEach((range, index) => {
      if (index + 1 === ranges.length) {
        validRanges.push(range);
        return;
      }
      const nextRange = ranges[index + 1];
      const nextRangeMin = nextRange.getMin();
      const isCorrectPair = range.getCurrent() === nextRangeMin
        && range.getMax() === nextRange.getCurrent();
      if (isCorrectPair) {
        validRanges.push(range);
        return;
      }
      const isBecameCorrectPair = range.setCurrent(nextRangeMin) === nextRangeMin
        && range.getMax() === nextRange.setCurrent(range.getMax());
      if (isBecameCorrectPair) validRanges.push(range);
    });
    return validRanges;
  }

  private static _sortRanges(ranges: IRange[]) {
    return ranges.sort((a, b) => {
      if (a.getMin() - b.getMin()) {
        return a.getMin() - b.getMin();
      }
      return a.getMax() - b.getMax();
    });
  }

  private static _defineActualRanges(length: number) {
    if (Slider._isPrime(length)) {
      return Slider._defineActualRangesTogether(length);
    }
    return Slider._defineActualRangesReasonably(length);
  }

  private static _isPrime(number: number): boolean {
    let isPrime = true;
    for (let i = 2; i < number; i += 1) {
      if (number % i === 0) {
        isPrime = false;
        break;
      }
    }
    return isPrime;
  }

  private static _defineActualRangesTogether(
    length: number,
  ): number[] {
    if (length <= 1) return [0];
    const actualRanges = [];
    for (let i = 1; i < length; i += 1) actualRanges.push(i);
    return actualRanges;
  }

  private static _defineActualRangesReasonably(
    length: number,
  ): number[] {
    const actualRanges = [];
    for (let i = length - 1; i > 0; i -= 1) {
      if (length % i === 0) {
        for (let j = 0; j < length; j += 1) {
          if (j % i !== 0) {
            actualRanges.push(j);
          }
        }
        break;
      }
    }
    return actualRanges;
  }

  private _configure(options?: TSlider) {
    const config = { ...options };
    this._active = this.setActive(config.active);
    this._step = this.setStep(config.step);
    this._actualRanges = this.setActualRanges(config.actualRanges);
    const min = config.min || config.min === 0 ? config.min : null;
    if (min || min === 0) this.setMin(min);
    const max = config.max || config.max === 0 ? config.max : null;
    if (max || max === 0) this.setMax(max);
    const value = config.value || config.value === 0
      ? config.value : null;
    if (value || value === 0) this.setValue(value);
    const minInterval = config.minInterval || config.minInterval === 0
      ? config.minInterval : null;
    if (minInterval || minInterval === 0) this.setMinInterval(minInterval);
    const maxInterval = config.maxInterval || config.maxInterval === 0
      ? config.maxInterval : null;
    if (maxInterval || maxInterval === 0) this.setMaxInterval(maxInterval);
  }

  private _isCorrectIndex(index: number) {
    return (index >= 0
      && index < this._ranges.length
      && Number.isInteger(index)
    );
  }

  private _setValueByIndex(value: number, index: number) {
    const correctedValue = this._correctValueByStep(value);
    const newValue = this._ranges[index].setCurrent(correctedValue);
    if (this._isCorrectIndex(index - 1)) {
      this._ranges[index - 1].setMax(newValue);
    }
    if (this._isCorrectIndex(index + 1)) {
      this._ranges[index + 1].setMin(newValue);
    }
    return newValue;
  }

  private _getPerValueByIndex(index: number) {
    const perValue = ((this._ranges[index].getCurrent() - this.getMin())
      / this.getAbsoluteRange()) * 100;
    return Number.isNaN(perValue) ? 0 : perValue;
  }

  private _getIndexCloseOfValue(value: number) {
    const index = this._getIndexByValue(value);
    const inRange: IRange = this._getRange(index) as IRange;
    const prevRange: IRange | null = this._getRange(index - 1);
    if (!prevRange) return index;
    return (inRange.getCurrent() - value < value - prevRange.getCurrent()
      ? index : index - 1);
  }

  private _getIndexByValue(value: number) {
    return this._ranges.findIndex((range, index) => (
      range.getMin() <= value
        && (value <= range.getCurrent()
        || index === this._ranges.length - 1)
    ));
  }

  private _getRange(index: number): IRange | null {
    if (!this._isCorrectIndex(index)) return null;
    return this._ranges[index];
  }

  private _correctValueByStep(value: number) {
    const correctedValue = Math.round(
      (value - this.getMin()) / this._step,
    ) * this._step + this.getMin();
    return Corrector.makeCorrecterValueTailBy(this._step)(
      correctedValue,
    );
  }
}

export { Slider, ISlider, TSlider };
