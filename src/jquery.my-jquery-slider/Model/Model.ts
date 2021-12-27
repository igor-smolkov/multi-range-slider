import { EventEmitter, IEventEmitter } from '../EventEmitter';
import { TMyJQuerySlider, SliderOrientation } from '../TMyJQuerySlider';
import { IRange, Range } from './Range';
import {
  List, IList, TOrderedItems, TList, TDisorderedItems,
} from './List';
import { Slider, ISlider, TSlider } from './Slider';

enum ModelEvent {
  change = 'change',
  changeActive = 'change-active',
}

type TWordySliderRangeOptions = {
  min: number;
  minInterval: number;
  value: number;
  maxInterval: number;
  max: number;
};

interface IModel {
  on(event: ModelEvent, callback: () => unknown): void;
  update(options?: TMyJQuerySlider): void;
  getConfig(): TMyJQuerySlider;
  getValues(): number[];
  getNames(): string[];
  getPerValues(): number[];
  getList(): TOrderedItems;
  setValue(value: number): void;
  setPerValue(perValue: number): void;
  setActive(active: number): void;
  setActiveCloseOfValue(value: number): void;
  stepForward(): void;
  stepBackward(): void;
}

class Model implements IModel {
  private eventEmitter: IEventEmitter;

  private ranges: IRange[];

  private slider: ISlider;

  private list: IList;

  private config: TMyJQuerySlider = {};

  constructor(options: TMyJQuerySlider = {}) {
    this.eventEmitter = new EventEmitter();
    this.setConfig(options);

    this.ranges = this.makeRanges();
    this.slider = new Slider(this.ranges, this.getSliderConfig());
    this.list = new List(this.getListConfig());
    this.correctLimitsForList();
    this.refreshConfig();
  }

  public on(event: string, callback: () => unknown): void {
    this.eventEmitter.subscribe(event, callback);
  }

  public update(options: TMyJQuerySlider = {}): void {
    const isCriticalChanges = options.limits
      || (!Model.isSimpleSlider(options) && !this.isMultiSlider())
      || (this.isMultiSlider() && options.isDouble === false);
    this.setConfig(options);
    if (isCriticalChanges) this.make();
    else this.updateComponents(options);
    this.notify();
  }

  public getConfig(): TMyJQuerySlider {
    return { ...this.config };
  }

  public getValues(): number[] {
    return [...this.slider.getValues()];
  }

  public getNames(): string[] {
    return this.slider
      .getValues()
      .map((v) => (
        this.list.getClosestNameByValue(
          v,
          this.slider.getAbsoluteRange(),
        )
      ));
  }

  public getPerValues(): number[] {
    return [...this.slider.getPerValues()];
  }

  public getList(): TOrderedItems {
    return this.list.getItems();
  }

  public setValue(value: number): void {
    this.slider.setValue(value);
    this.refresh();
  }

  public setPerValue(perValue: number): void {
    this.slider.setPerValue(perValue);
    this.refresh();
  }

  public setActive(index: number): void {
    this.slider.setActive(index);
    this.refresh();
  }

  public setActiveCloseOfValue(value: number): void {
    this.slider.setActiveCloseOfValue(value);
    this.refresh();
  }

  public stepForward(): void {
    this.slider.stepForward();
    this.refresh();
  }

  public stepBackward(): void {
    this.slider.stepBackward();
    this.refresh();
  }

  private static makeLimitsFromOptions(
    options: TMyJQuerySlider,
  ): number[] {
    const defaultLimits: TWordySliderRangeOptions = {
      min: 0,
      minInterval: 25,
      value: 50,
      maxInterval: 75,
      max: 100,
    };
    const withMinMax: TWordySliderRangeOptions = {
      min: options.min as number,
      minInterval: options.min as number,
      value: options.max as number,
      maxInterval: options.max as number,
      max: options.max as number,
    };
    if (options.limits) {
      return Model.makeLimitsFromOptionsLimits(
        options.limits,
        defaultLimits,
      );
    }
    if (Model.isSimpleSlider(options)) {
      return Model.makeLimitsFromSimpleOptions(
        options.value as number,
        defaultLimits,
        withMinMax,
      );
    }
    const withFirstActiveRangeValue = options.active === 0
      ? { minInterval: options.value } : {};
    const withSecondActiveRangeValue = options.active === 1
      ? { maxInterval: options.value } : {};
    const withIntervals = {
      minInterval: options.minInterval,
      maxInterval: options.maxInterval,
    };
    return [
      withMinMax.min ?? defaultLimits.min,
      withIntervals.minInterval
        ?? withFirstActiveRangeValue.minInterval
        ?? withMinMax.minInterval
        ?? defaultLimits.minInterval,
      withIntervals.maxInterval
        ?? withSecondActiveRangeValue.maxInterval
        ?? withMinMax.maxInterval
        ?? defaultLimits.maxInterval,
      withMinMax.max ?? defaultLimits.max,
    ];
  }

  private static makeLimitsFromOptionsLimits(
    limits: number[],
    defaults: TWordySliderRangeOptions,
  ): number[] {
    if (limits.length === 0) {
      return [defaults.min, defaults.value, defaults.max];
    }
    if (limits.length === 1) {
      return [defaults.min, limits[0]];
    }
    return limits;
  }

  private static makeLimitsFromSimpleOptions(
    value: number,
    defaults: TWordySliderRangeOptions,
    withMinMax: TWordySliderRangeOptions,
  ): number[] {
    return [
      withMinMax.min ?? defaults.min,
      value ?? withMinMax.value ?? defaults.value,
      withMinMax.max ?? defaults.max,
    ];
  }

  private static isSimpleSlider(options: TMyJQuerySlider): boolean {
    return !(options.isDouble
      || (options.minInterval && options.maxInterval)
    );
  }

  private isMultiSlider() {
    return this.config.limits && this.config.limits.length > 3;
  }

  private setConfig(options: TMyJQuerySlider) {
    const defaults: TMyJQuerySlider = {
      orientation: SliderOrientation.horizontal,
      withLabel: false,
      withIndent: true,
      withNotch: true,
      label: null,
      scale: null,
      segments: null,
      lengthPx: null,
      min: null,
      max: null,
      value: null,
      step: null,
      isDouble: null,
      minInterval: null,
      maxInterval: null,
      limits: null,
      active: null,
      actualRanges: null,
      list: null,
    };
    this.config = { ...defaults, ...this.config, ...options };
    const settings = {
      active: options.active
        ?? (options.isDouble ? 1 : this.config.active),
      actualRanges: options.actualRanges
        ?? (options.isDouble ? [1] : this.config.actualRanges),
      limits: Model.makeLimitsFromOptions(options),
    };
    this.config = { ...this.config, ...settings };
  }

  private refreshConfig() {
    const state: TMyJQuerySlider = {
      min: this.slider.getMin(),
      max: this.slider.getMax(),
      value: this.slider.getValue(),
      step: this.slider.getStep(),
      isDouble: this.slider.isDouble(),
      minInterval: this.slider.getMinInterval(),
      maxInterval: this.slider.getMaxInterval(),
      limits: this.slider.getLimits(),
      active: this.slider.getActive(),
      actualRanges: this.slider.getActualRanges(),

      list: Array.from(this.list.getItems()),
    };
    this.config = { ...this.config, ...state };
  }

  private make() {
    this.ranges = this.makeRanges();
    this.slider = new Slider(this.ranges, this.getSliderConfig());
    this.list = new List(this.getListConfig());
    this.correctLimitsForList();
    this.refreshConfig();
  }

  private makeRanges(): IRange[] {
    const limits = this.config.limits as number[];
    if (limits.length < 3) {
      return [new Range({ min: limits[0], max: limits[1] })];
    }
    const ranges: IRange[] = [];
    for (let i = 1; i < limits.length - 1; i += 1) {
      ranges.push(
        new Range({
          min: limits[i - 1],
          max: limits[i + 1],
          current: limits[i],
        }),
      );
    }
    return ranges;
  }

  private getSliderConfig(options: TMyJQuerySlider = {}): TSlider {
    const config = Object.keys(options).length
      ? options
      : this.config;
    return {
      min: config.min as number,
      max: config.max as number,
      step: config.step as number,
      active: config.active as number,
      value: config.value as number,
      minInterval: config.minInterval as number,
      maxInterval: config.maxInterval as number,
      actualRanges: config.actualRanges as number[],
    };
  }

  private getListConfig(): TList {
    return {
      items: this.config.list as TDisorderedItems,
      startKey: this.slider.getMin(),
      step: this.slider.getStep(),
    };
  }

  private correctLimitsForList() {
    const [maxKey, minKey] = [
      this.list.getMaxKey(),
      this.list.getMinKey(),
    ];
    const isCorrectOfMinNecessary = minKey !== null
      && minKey < this.slider.getMin();
    if (isCorrectOfMinNecessary) this.slider.setMin(minKey as number);
    const isCorrectOfMaxNecessary = maxKey !== null
      && (maxKey > this.slider.getMax() || this.list.isFlat());
    if (isCorrectOfMaxNecessary) this.slider.setMax(maxKey as number);
  }

  private updateComponents(options: TMyJQuerySlider) {
    this.slider.update(this.getSliderConfig(options));
    if (options.list) {
      this.list.update(this.getListConfig());
      this.correctLimitsForList();
    }
    this.refreshConfig();
  }

  private notify() {
    this.eventEmitter.emit(ModelEvent.change);
  }

  private refresh() {
    this.refreshConfig();
    this.notify();
  }
}
export { Model, IModel, ModelEvent };
