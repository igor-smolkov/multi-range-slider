import Corrector from '../Corrector';
import { IRange } from './Range';

type TSlider = {
  min?: number;
  max?: number;
  activeRange?: number;
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
  getActiveRange(): number;
  setActiveRange(activeRange: number): number;
  setActiveRangeCloseOfValue(value: number): number;
  getValues(): number[];
  getPerValues(): number[];
  getLimits(): number[];
  isDouble(): boolean;
  getAbsoluteRange(): number;
  stepForward(): void;
  stepBackward(): void;
}

class Slider implements ISlider {
  private ranges: IRange[];

  private activeRange = 0;

  private step = 1;

  private actualRanges: number[] | null = null;

  constructor(ranges: IRange[], options?: TSlider) {
    this.ranges = Slider.correctRanges(ranges);
    this.configure(options);
  }

  public update(options: TSlider): void {
    this.configure(options);
  }

  public setMin(limit: number): number {
    if (!this.ranges.find((range) => limit <= range.getMax())) {
      return this.ranges[0].getMin();
    }
    this.ranges[0].setMin(limit);
    let cutIndex = 0;
    this.ranges.forEach((range, index) => {
      if (limit > range.getMin()) {
        range.setMin(limit);
      }
      if (limit > range.getMax()) {
        cutIndex = index + 1;
      }
    });
    this.ranges.splice(0, cutIndex);
    return this.ranges[0].getMin();
  }

  public getMin(): number {
    return this.ranges[0].getMin();
  }

  public setMax(limit: number): number {
    if (!this.ranges.find((range) => limit >= range.getMin())) {
      return this.ranges[0].getMax();
    }
    this.ranges[this.ranges.length - 1].setMax(limit);
    let cutIndex = 0;
    const ranges = this.ranges.slice().reverse();
    ranges.forEach((range, index) => {
      if (limit < range.getMax()) {
        range.setMax(limit);
      }
      if (limit < range.getMin()) {
        cutIndex = index + 1;
      }
    });
    ranges.splice(0, cutIndex);
    this.ranges = ranges.slice().reverse();
    return this.ranges[this.ranges.length - 1].getMax();
  }

  public getMax(): number {
    return this.ranges[this.ranges.length - 1].getMax();
  }

  public setValue(value: number): number {
    return this.setValueByIndex(value, this.activeRange);
  }

  public getValue(): number {
    return this.ranges[this.activeRange].getCurrent();
  }

  public setPerValue(perValue: number): number {
    const newValue = (perValue * this.getAbsoluteRange())
      / 100 + this.getMin();
    return this.setValue(newValue);
  }

  public setStep(step?: number): number {
    const range = this.getAbsoluteRange();
    const isValid = step && step > 0 && step <= range;
    const defaultStep = range >= 1 ? 1
      : Corrector.makeCorrecterValueTailBy(this.getMax(), this.getMin())(range);
    this.step = isValid ? step as number : defaultStep;
    return this.getStep();
  }

  public getStep(): number {
    return this.step;
  }

  public setMinInterval(value: number): number {
    this.setValueByIndex(value, 0);
    return this.getMinInterval();
  }

  public getMinInterval(): number {
    return this.ranges[0].getCurrent();
  }

  public setMaxInterval(value: number): number {
    this.setValueByIndex(value, this.ranges.length - 1);
    return this.getMaxInterval();
  }

  public getMaxInterval(): number {
    return this.ranges[this.ranges.length - 1].getCurrent();
  }

  public setActiveRange(activeRange?: number): number {
    this.activeRange = this.isCorrectIndex(activeRange as number)
      ? activeRange as number
      : this.activeRange ?? 0;
    return this.activeRange;
  }

  public getActiveRange(): number {
    return this.activeRange;
  }

  public setActiveRangeCloseOfValue(value: number): number {
    const index = this.getIndexCloseOfValue(value);
    return this.setActiveRange(index);
  }

  public isDouble(): boolean {
    return this.ranges.length === 2;
  }

  public getLimits(): number[] {
    const limits: number[] = [];
    this.ranges.forEach((range, index) => {
      if (index === 0) {
        limits.push(range.getMin());
      }
      limits.push(range.getCurrent());
      if (index === this.ranges.length - 1) {
        limits.push(range.getMax());
      }
    });
    return limits;
  }

  public getValues(): number[] {
    return this.ranges.map((r) => r.getCurrent());
  }

  public getPerValues(): number[] {
    const perValues: number[] = [];
    this.ranges.forEach((_, index) => {
      perValues.push(this.getPerValueByIndex(index));
    });
    return perValues;
  }

  public setActualRanges(actualRanges?: number[]): number[] | null {
    const isDefault = !this.actualRanges || actualRanges === null;
    if (isDefault) {
      this.actualRanges = Slider.defineActualRanges(
        this.ranges.length,
      );
    }
    const isOff = actualRanges && !actualRanges.length;
    if (isOff) {
      this.actualRanges = [];
      return this.actualRanges;
    }
    if (!actualRanges) return this.actualRanges;
    const newActualRanges: number[] = [];
    actualRanges.forEach((actual) => {
      if (this.isCorrectIndex(actual)) {
        newActualRanges.push(actual);
      }
    });
    this.actualRanges = newActualRanges.length
      ? newActualRanges
      : this.actualRanges;
    return this.getActualRanges();
  }

  public getActualRanges(): number[] | null {
    return this.actualRanges;
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

  private static correctRanges(ranges: IRange[]) {
    const validRanges: IRange[] = [];
    Slider.sortRanges(ranges).forEach((range, index) => {
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

  private static sortRanges(ranges: IRange[]) {
    return ranges.sort((a, b) => {
      if (a.getMin() - b.getMin()) {
        return a.getMin() - b.getMin();
      }
      return a.getMax() - b.getMax();
    });
  }

  private static defineActualRanges(length: number) {
    if (Slider.isPrime(length)) {
      return Slider.defineActualRangesTogether(length);
    }
    return Slider.defineActualRangesReasonably(length);
  }

  private static isPrime(number: number): boolean {
    let isPrime = true;
    for (let i = 2; i < number; i += 1) {
      if (number % i === 0) {
        isPrime = false;
        break;
      }
    }
    return isPrime;
  }

  private static defineActualRangesTogether(
    length: number,
  ): number[] {
    if (length <= 1) return [0];
    const actualRanges = [];
    for (let i = 1; i < length; i += 1) actualRanges.push(i);
    return actualRanges;
  }

  private static defineActualRangesReasonably(
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

  private configure(options?: TSlider) {
    const config = { ...options };
    this.activeRange = this.setActiveRange(config.activeRange);
    this.actualRanges = this.setActualRanges(config.actualRanges);
    const min = config.min || config.min === 0 ? config.min : null;
    if (min || min === 0) this.setMin(min);
    const max = config.max || config.max === 0 ? config.max : null;
    if (max || max === 0) this.setMax(max);
    this.step = this.setStep(config.step);
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

  private isCorrectIndex(index: number) {
    return (index >= 0
      && index < this.ranges.length
      && Number.isInteger(index)
    );
  }

  private setValueByIndex(value: number, index: number) {
    const correctedValue = this.correctValueByStep(value);
    const newValue = this.ranges[index].setCurrent(correctedValue);
    if (this.isCorrectIndex(index - 1)) {
      this.ranges[index - 1].setMax(newValue);
    }
    if (this.isCorrectIndex(index + 1)) {
      this.ranges[index + 1].setMin(newValue);
    }
    return newValue;
  }

  private getPerValueByIndex(index: number) {
    const perValue = ((this.ranges[index].getCurrent() - this.getMin())
      / this.getAbsoluteRange()) * 100;
    return Number.isNaN(perValue) ? 0 : perValue;
  }

  private getIndexCloseOfValue(value: number) {
    const index = this.getIndexByValue(value);
    const inRange: IRange = this.getRange(index) as IRange;
    const prevRange: IRange | null = this.getRange(index - 1);
    if (!prevRange) return index;
    return (inRange.getCurrent() - value < value - prevRange.getCurrent()
      ? index : index - 1);
  }

  private getIndexByValue(value: number) {
    return this.ranges.findIndex((range, index) => (
      range.getMin() <= value
        && (value <= range.getCurrent()
        || index === this.ranges.length - 1)
    ));
  }

  private getRange(index: number): IRange | null {
    if (!this.isCorrectIndex(index)) return null;
    return this.ranges[index];
  }

  private correctValueByStep(value: number) {
    const correctedValue = Math.round(
      (value - this.getMin()) / this.step,
    ) * this.step + this.getMin();
    return Corrector.makeCorrecterValueTailBy(this.step, this.getMin(), this.getMax())(
      correctedValue,
    );
  }
}

export { Slider, ISlider, TSlider };
