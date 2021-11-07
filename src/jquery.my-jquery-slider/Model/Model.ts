import { EventEmitter, IEventEmitter } from '../EventEmitter';
import TMyJQuerySlider from '../TMyJQuerySlider';
import { IRange, Range } from './Range';
import {
  List, IList, TOrderedItems, TList,
} from './List';
import { Slider, ISlider, TSlider } from './Slider';

type TWordySliderRangeOptions = {
  min: number,
  minInterval: number,
  value: number,
  maxInterval: number,
  max: number,
};

interface IModel {
  on(event: string, callback: ()=>unknown): void;
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
  private _eventEmitter: IEventEmitter

  private _ranges: IRange[];

  private _slider: ISlider;

  private _list: IList;

  private _config: TMyJQuerySlider;

  constructor(options: TMyJQuerySlider = {}) {
    this._eventEmitter = new EventEmitter();
    this._setConfig(options);
    this._make();
  }

  public on(event: string, callback: ()=>unknown): void {
    this._eventEmitter.subscribe(event, callback);
  }

  public update(options: TMyJQuerySlider = {}): void {
    const isCriticalChanges = !Model._isSimpleSlider(options) || options.limits
      || ((this._config.limits.length > 3) && (options.isDouble === false));
    this._setConfig(options);
    if (isCriticalChanges) {
      this._make();
    } else {
      this._slider.update(this._getSliderConfig(options));
      if (options.list) {
        this._list.update(this._getListConfig());
        this._correctLimitsForList();
      }
      this._refreshConfig();
    }
    this._notify();
  }

  public getConfig(): TMyJQuerySlider {
    return { ...this._config };
  }

  public getValues(): number[] {
    return [...this._slider.getValues()];
  }

  public getNames(): string[] {
    return this._slider.getValues().map(
      (v) => this._list.getClosestNameByValue(v, this._slider.getAbsoluteRange()),
    );
  }

  public getPerValues(): number[] {
    return [...this._slider.getPerValues()];
  }

  public getList(): TOrderedItems {
    return this._list.getItems();
  }

  public setValue(value :number): void {
    this._slider.setValue(value);
    this._refresh();
  }

  public setPerValue(perValue: number): void {
    this._slider.setPerValue(perValue);
    this._refresh();
  }

  public setActive(index: number): void {
    this._slider.setActive(index);
    this._refresh();
  }

  public setActiveCloseOfValue(value: number): void {
    this._slider.setActiveCloseOfValue(value);
    this._refresh();
  }

  public stepForward(): void {
    this._slider.stepForward();
    this._refresh();
  }

  public stepBackward(): void {
    this._slider.stepBackward();
    this._refresh();
  }

  private static _makeLimitsFromOptions(options: TMyJQuerySlider): number[] {
    const defaultLimits: TWordySliderRangeOptions = {
      min: 0,
      minInterval: 25,
      value: 50,
      maxInterval: 75,
      max: 100,
    };
    const withMinMax: TWordySliderRangeOptions = {
      min: options.min,
      minInterval: options.min,
      value: options.max,
      maxInterval: options.max,
      max: options.max,
    };
    if (options.limits) return Model._makeLimitsFromOptionsLimits(options.limits, defaultLimits);
    if (Model._isSimpleSlider(options)) {
      return Model._makeLimitsFromSimpleOptions(options.value, defaultLimits, withMinMax);
    }
    const withFirstActiveRangeValue = options.active === 0 ? { minInterval: options.value } : {};
    const withSecondActiveRangeValue = options.active === 1 ? { maxInterval: options.value } : {};
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

  private static _makeLimitsFromOptionsLimits(
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

  private static _makeLimitsFromSimpleOptions(
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

  private static _isSimpleSlider(options: TMyJQuerySlider): boolean {
    return !(options.isDouble || (options.minInterval && options.maxInterval));
  }

  private _setConfig(options: TMyJQuerySlider) {
    const defaults: TMyJQuerySlider = {
      orientation: 'horizontal',
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
    this._config = { ...defaults, ...this._config, ...options };
    const settings = {
      active: options.active ?? (options.isDouble ? 1 : this._config.active),
      actualRanges: options.actualRanges ?? (options.isDouble ? [1] : this._config.actualRanges),
      limits: Model._makeLimitsFromOptions(options),
    };
    this._config = { ...this._config, ...settings };
  }

  private _refreshConfig() {
    const state: TMyJQuerySlider = {
      min: this._slider.getMin(),
      max: this._slider.getMax(),
      value: this._slider.getValue(),
      step: this._slider.getStep(),
      isDouble: this._slider.isDouble(),
      minInterval: this._slider.getMinInterval(),
      maxInterval: this._slider.getMaxInterval(),
      limits: this._slider.getLimits(),
      active: this._slider.getActive(),
      actualRanges: this._slider.getActualRanges(),

      list: Array.from(this._list.getItems()),
    };
    this._config = { ...this._config, ...state };
  }

  private _make() {
    this._ranges = this._makeRanges();
    this._slider = new Slider(this._ranges, this._getSliderConfig());
    this._list = new List(this._getListConfig());
    this._correctLimitsForList();
    this._refreshConfig();
  }

  private _makeRanges(): IRange[] {
    const { limits } = this._config;
    if (limits.length < 3) return [new Range({ min: limits[0], max: limits[1] })];
    const ranges: IRange[] = [];
    for (let i = 1; i < limits.length - 1; i += 1) {
      ranges.push(new Range({
        min: limits[i - 1],
        max: limits[i + 1],
        current: limits[i],
      }));
    }
    return ranges;
  }

  private _getSliderConfig(options: TMyJQuerySlider = {}): TSlider {
    const config = Object.keys(options).length ? options : this._config;
    return {
      min: config.min,
      max: config.max,
      step: config.step,
      active: config.active,
      value: config.value,
      minInterval: config.minInterval,
      maxInterval: config.maxInterval,
      actualRanges: config.actualRanges,
    };
  }

  private _getListConfig(): TList {
    return {
      items: this._config.list,
      startKey: this._slider.getMin(),
      step: this._slider.getStep(),
    };
  }

  private _correctLimitsForList() {
    const [maxKey, minKey] = [this._list.getMaxKey(), this._list.getMinKey()];
    const isCorrectOfMinNecessary = minKey < this._slider.getMin() && minKey !== null;
    if (isCorrectOfMinNecessary) this._slider.setMin(minKey);
    const isCorrectOfMaxNecessary = (maxKey > this._slider.getMax() || this._list.isFlat())
      && maxKey !== null;
    if (isCorrectOfMaxNecessary) this._slider.setMax(maxKey);
  }

  private _notify() {
    this._eventEmitter.emit('change');
  }

  private _refresh() {
    this._refreshConfig();
    this._notify();
  }
}
export { Model, IModel };
