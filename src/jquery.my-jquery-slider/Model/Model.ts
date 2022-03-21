import { EventEmitter, IEventEmitter } from '../EventEmitter';
import { IRange, Range } from './Range';
import {
  LabelsList, ILabelsList, TOrderedLabels, LabelsListConfig, TDisorderedLabels,
} from './LabelsList';
import {
  Slider, ISlider, SliderConfig,
} from './Slider';
import { IModelView, ModelView, ModelViewConfig } from './ModelView';

enum ModelEvent {
  init = 'init',
  update = 'update',
}

type Config = ModelViewConfig & SliderConfig & Pick<LabelsListConfig, 'labelsList'>;

type Changes = {
  config: Config,
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
  init(options?: Partial<Config>): void;
  update(options?: Partial<Config>): void;
  setValue(valuePac: ValuePac): void;
  stepForward(): void;
  stepBackward(): void;
}

class Model implements IModel {
  private eventEmitter: IEventEmitter;

  private ranges: IRange[];

  private slider: ISlider;

  private labelsList: ILabelsList;

  private modelView: IModelView;

  constructor() {
    this.eventEmitter = new EventEmitter();
    this.ranges = [new Range()];
    this.slider = new Slider(this.ranges);
    this.labelsList = new LabelsList();
    this.modelView = new ModelView();
  }

  public on(event: string, callback: () => unknown): void {
    this.eventEmitter.subscribe(event, callback);
  }

  public init(options?: Partial<Config>): void {
    this.make({ ...options });
    this.notify(ModelEvent.init);
  }

  public update(options?: Partial<Config>): void {
    const { limits } = this.slider.getConfig();
    const isCriticalChanges = options?.limits
      || (!Model.isSimpleSlider({ ...options }) && !Model.isMultiSlider(limits))
      || (Model.isMultiSlider(limits) && options?.isDouble === false);
    if (isCriticalChanges) this.make({ ...options });
    else this.updateComponents({ ...options });
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

    this.notify(ModelEvent.update);
  }

  public stepForward(): void {
    this.slider.stepForward();
    this.notify(ModelEvent.update);
  }

  public stepBackward(): void {
    this.slider.stepBackward();
    this.notify(ModelEvent.update);
  }

  private static makeLimitsFromOptions(
    options: Partial<Config>,
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

  private static isSimpleSlider(options: Partial<Config>): boolean {
    return !(options.isDouble
      || (options.minInterval && options.maxInterval)
    );
  }

  private static isMultiSlider(limits?: number[] | null) {
    return limits && limits.length > 3;
  }

  private static makeRanges(limits: number[]): IRange[] {
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

  private static defineSettings(options: Partial<Config>) {
    const settings = {
      activeRange: options.activeRange
        ?? (options.isDouble ? 1 : undefined),
      actualRanges: options.actualRanges
        ?? (options.isDouble ? [1] : null),
      limits: Model.makeLimitsFromOptions(options),
    };
    return { ...options, ...settings };
  }

  private collectConfig() {
    return {
      ...this.modelView.getConfig(),
      ...this.slider.getConfig(),
      labelsList: Array.from(this.labelsList.getLabels()),
    };
  }

  private make(options: Partial<Config>) {
    const settings = Model.defineSettings(options);
    const { limits, labelsList } = { ...settings };
    this.ranges = Model.makeRanges(limits);
    this.slider = new Slider(this.ranges, settings);
    this.labelsList = new LabelsList(this.defineLabelsListOptions(labelsList));
    this.modelView.update(settings);
    this.correctLimitsForLabelsList();
  }

  private defineLabelsListOptions(
    labelsList?: TDisorderedLabels | null,
  ): LabelsListConfig {
    return {
      labelsList: labelsList ?? [],
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

  private updateComponents(options: Partial<Config>) {
    const { labelsList } = { ...options };
    this.slider.update(options);
    if (labelsList) {
      this.labelsList.update(this.defineLabelsListOptions(labelsList));
      this.correctLimitsForLabelsList();
    }
    this.modelView.update(options);
  }

  private notify(event: string) {
    this.eventEmitter.emit(event, this.getChanges());
  }

  private getChanges(): Changes {
    return ({
      config: this.collectConfig(),
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
  Model, IModel, ModelEvent, Changes, ValuePac, Config,
};
