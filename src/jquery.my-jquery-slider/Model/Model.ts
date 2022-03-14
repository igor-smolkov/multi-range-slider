import { EventEmitter, IEventEmitter } from '../EventEmitter';
import { TMyJQuerySlider, SliderOrientation } from '../TMyJQuerySlider';
import { IRange, Range } from './Range';
import {
  LabelsList, ILabelsList, TOrderedLabels, TLabelsList, TDisorderedLabels,
} from './LabelsList';
import { Slider, ISlider, TSlider } from './Slider';

enum ModelEvent {
  init = 'init',
  update = 'update',
}

type Changes = {
  config: TMyJQuerySlider,
  values: number[],
  names: string[],
  perValues: number[],
  labelsList: TOrderedLabels,
}

type ValuePac = {
  activeRange?: number,
  value?: number,
  perValue?: number,
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
  init(options?: TMyJQuerySlider): void;
  update(options?: TMyJQuerySlider): void;
  setValue(valuePac: ValuePac): void;
  stepForward(): void;
  stepBackward(): void;
}

class Model implements IModel {
  private eventEmitter: IEventEmitter;

  private ranges: IRange[];

  private slider: ISlider;

  private labelsList: ILabelsList;

  private config: TMyJQuerySlider = {};

  constructor() {
    this.eventEmitter = new EventEmitter();
    this.ranges = [new Range()];
    this.slider = new Slider(this.ranges);
    this.labelsList = new LabelsList();
  }

  public on(event: string, callback: () => unknown): void {
    this.eventEmitter.subscribe(event, callback);
  }

  public init(options: TMyJQuerySlider = {}): void {
    this.setConfig(options);
    this.ranges = this.makeRanges();
    this.slider = new Slider(this.ranges, this.getSliderConfig());
    this.labelsList = new LabelsList(this.getLabelsListConfig());
    this.correctLimitsForLabelsList();
    this.refreshConfig();
    this.notify(ModelEvent.init);
  }

  public update(options: TMyJQuerySlider = {}): void {
    const isCriticalChanges = options.limits
      || (!Model.isSimpleSlider(options) && !this.isMultiSlider())
      || (this.isMultiSlider() && options.isDouble === false);
    this.setConfig(options);
    if (isCriticalChanges) this.make();
    else this.updateComponents(options);
    this.notify(ModelEvent.update);
  }

  public setValue(valuePac: ValuePac): void {
    const { activeRange, value, perValue } = { ...valuePac };

    if (activeRange !== undefined) {
      this.slider.setActiveRange(activeRange);
    } else if (value !== undefined) {
      this.slider.setActiveRangeCloseOfValue(value);
    }

    if (value !== undefined) {
      this.slider.setValue(value);
    }

    if (perValue !== undefined) {
      this.slider.setPerValue(perValue);
    }

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
    const withFirstActiveRangeValue = options.activeRange === 0
      ? { minInterval: options.value } : {};
    const withSecondActiveRangeValue = options.activeRange === 1
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
      scaleSegments: null,
      lengthPx: null,
      min: null,
      max: null,
      value: null,
      step: null,
      isDouble: null,
      minInterval: null,
      maxInterval: null,
      limits: null,
      activeRange: null,
      actualRanges: null,
      labelsList: null,
    };
    this.config = { ...defaults, ...this.config, ...options };
    const settings = {
      activeRange: options.activeRange
        ?? (options.isDouble ? 1 : this.config.activeRange),
      actualRanges: options.actualRanges
        ?? (options.isDouble ? [1] : this.config.actualRanges),
      limits: Model.makeLimitsFromOptions(options),
    };
    this.config = { ...this.config, ...settings };
  }

  private refreshConfig() {
    const state: TMyJQuerySlider = {
      ...this.slider.getConfig(),
      labelsList: Array.from(this.labelsList.getLabels()),
    };
    this.config = { ...this.config, ...state };
  }

  private make() {
    this.ranges = this.makeRanges();
    this.slider = new Slider(this.ranges, this.getSliderConfig());
    this.labelsList = new LabelsList(this.getLabelsListConfig());
    this.correctLimitsForLabelsList();
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
    const {
      min, max, step, activeRange, value,
      minInterval, maxInterval, actualRanges,
    } = config;
    return {
      min: min ?? undefined,
      max: max ?? undefined,
      step: step ?? undefined,
      activeRange: activeRange ?? undefined,
      value: value ?? undefined,
      minInterval: minInterval ?? undefined,
      maxInterval: maxInterval ?? undefined,
      actualRanges: actualRanges ?? undefined,
    };
  }

  private getLabelsListConfig(): TLabelsList {
    return {
      labels: this.config.labelsList as TDisorderedLabels,
      startKey: this.slider.getMin(),
      step: this.slider.getStep(),
    };
  }

  private correctLimitsForLabelsList() {
    const [maxKey, minKey] = [
      this.labelsList.getMaxKey(),
      this.labelsList.getMinKey(),
    ];
    const isCorrectOfMinNecessary = minKey !== null
      && minKey < this.slider.getMin();
    if (isCorrectOfMinNecessary) this.slider.setMin(minKey as number);
    const isCorrectOfMaxNecessary = maxKey !== null
      && (maxKey > this.slider.getMax() || this.labelsList.isFlat());
    if (isCorrectOfMaxNecessary) this.slider.setMax(maxKey as number);
  }

  private updateComponents(options: TMyJQuerySlider) {
    this.slider.update(this.getSliderConfig(options));
    if (options.labelsList) {
      this.labelsList.update(this.getLabelsListConfig());
      this.correctLimitsForLabelsList();
    }
    this.refreshConfig();
  }

  private notify(event: string) {
    this.eventEmitter.emit(event, this.getChanges());
  }

  private refresh() {
    this.refreshConfig();
    this.notify(ModelEvent.update);
  }

  private getChanges(): Changes {
    return ({
      config: { ...this.config },
      values: [...this.slider.getValues()],
      names: this.getNames(),
      perValues: [...this.slider.getPerValues()],
      labelsList: this.labelsList.getLabels(),
    });
  }

  private getNames(): string[] {
    return this.slider
      .getValues()
      .map((value) => (
        this.labelsList.getClosestNameByValue(
          value,
          this.slider.getAbsoluteRange(),
        )
      ));
  }
}
export {
  Model, IModel, ModelEvent, Changes, ValuePac,
};
