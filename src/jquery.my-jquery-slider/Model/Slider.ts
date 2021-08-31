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
}

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
  getActualRanges(): number[];
  getActive(): number;
  setActive(active: number): number;
  setActiveCloseOfValue(value: number): number;
  getPerValues(): number[];
  getLimits(): number[];
  isDouble(): boolean;
}

class Slider implements ISlider {
  private _ranges: IRange[];

  private _active: number;

  private _step: number;

  private _actualRanges: number[];

  constructor(ranges: IRange[], options?: TSlider) {
    this._ranges = Slider._correctRanges(ranges);
    this._configure(options);
  }

  public update(options: TSlider): void {
    this._configure(options);
  }

  public setMin(limit: number): number {
    if (!this._ranges.find((range) => limit <= range.getMax())) return this._ranges[0].getMin();
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
    if (!this._ranges.find((range) => limit >= range.getMin())) return this._ranges[0].getMax();
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
    const newValue = (perValue * this._getAbsoluteRange()) / 100 + this.getMin();
    return this.setValue(newValue);
  }

  public setStep(step: number): number {
    this._step = step && step > 0 ? step : 1;
    return this.getStep();
  }

  public getStep(): number {
    return this._step;
  }

  public setMinInterval(value: number): number {
    if (value <= this._ranges[0].getMax()) return this._setValueByIndex(value, 0);
    this._ranges.forEach((range, index) => {
      if (value > this.getMax()) {
        range.setMax(this.getMax());
      }
      if (value > range.getMax() && value < this.getMax()) {
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
      if (value < range.getMin() && value > this.getMin()) {
        range.setMin(value);
      }
      if (value < range.getCurrent()) {
        range.setCurrent(this._setValueByIndex(value, this._ranges.length - 1 - index));
      }
    });
    this._ranges = ranges.slice().reverse();
    return this.getMaxInterval();
  }

  public getMaxInterval(): number {
    return this._ranges[this._ranges.length - 1].getCurrent();
  }

  public setActive(active: number): number {
    this._active = this._isCorrectIndex(active) ? active : (this._active ?? 0);
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

  public getPerValues(): number[] {
    const perValues: number[] = [];
    this._ranges.forEach((_, index) => {
      perValues.push(this._getPerValueByIndex(index));
    });
    return perValues;
  }

  public setActualRanges(actualRanges: number[]): number[] {
    if (!this._actualRanges) this._actualRanges = Slider._defineActualRanges(this._ranges.length);
    if (!actualRanges) return this._actualRanges;
    const newActualRanges: number[] = [];
    actualRanges.forEach((actual) => {
      if (this._isCorrectIndex(actual)) {
        newActualRanges.push(actual);
      }
    });
    this._actualRanges = newActualRanges.length ? newActualRanges : this._actualRanges;
    return this.getActualRanges();
  }

  public getActualRanges(): number[] {
    return this._actualRanges;
  }

  private static _correctRanges(ranges: IRange[]) {
    const validRanges: IRange[] = [];
    ranges
      .sort((a, b) => {
        if (a.getMin() - b.getMin()) {
          return a.getMin() - b.getMin();
        }
        return a.getMax() - b.getMax();
      })
      .forEach((range, index) => {
        if (index + 1 !== ranges.length) {
          if (range.getCurrent() === ranges[index + 1].getMin()
            && range.getMax() === ranges[index + 1].getCurrent()) {
            validRanges.push(range);
          } else if (range.setCurrent(ranges[index + 1].getMin()) === ranges[index + 1].getMin()
            && range.getMax() === ranges[index + 1].setCurrent(range.getMax())) {
            validRanges.push(range);
          }
        } else {
          validRanges.push(range);
        }
      });
    return validRanges;
  }

  private static _defineActualRanges(length: number) {
    const actualRanges = [];
    let isPrime = true;
    for (let i = 2; i < length; i += 1) {
      if (length % i === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) {
      if (length > 1) {
        for (let i = 1; i < length; i += 1) {
          actualRanges.push(i);
        }
      } else {
        actualRanges.push(0);
      }
    } else {
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
    }
    return actualRanges;
  }

  private _configure(options: TSlider) {
    const config = { ...options };
    this._active = this.setActive(config.active);
    this._step = this.setStep(config.step);
    this._actualRanges = this.setActualRanges(config.actualRanges);
    if (config.min || config.min === 0) this.setMin(config.min);
    if (config.max || config.min === 0) this.setMax(config.max);
    if (config.value || config.min === 0) this.setValue(config.value);
    if (config.minInterval || config.min === 0) this.setMinInterval(config.minInterval);
    if (config.maxInterval || config.min === 0) this.setMaxInterval(config.maxInterval);
  }

  private _isCorrectIndex(index: number) {
    return ((index >= 0) && (index < this._ranges.length) && Number.isInteger(index));
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
    return ((this._ranges[index].getCurrent() - this.getMin()) / this._getAbsoluteRange()) * 100;
  }

  private _getIndexCloseOfValue(value: number) {
    const index = this._getIndexByValue(value);
    const inRange: IRange = this._getRange(index);
    const prevRange: IRange = this._getRange(index - 1);
    if (!prevRange) return index;
    return (inRange.getCurrent() - value < value - prevRange.getCurrent()) ? index : index - 1;
  }

  private _getIndexByValue(value: number) {
    return this._ranges.findIndex((range, index) => range.getMin() <= value
      && (value <= range.getCurrent() || index === this._ranges.length - 1));
  }

  private _getRange(index: number): IRange | null {
    if (!this._isCorrectIndex(index)) return null;
    return this._ranges[index];
  }

  private _getAbsoluteRange() {
    return this.getMax() - this.getMin();
  }

  private _correctValueByStep(value: number) {
    const correctedValue = Math.round((value * 1) / this._step) * this._step;
    return Corrector.makeCorrecterValueTailBy(this._step)(correctedValue);
  }
}

export { Slider, ISlider, TSlider };
