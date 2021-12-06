import Corrector from '../Corrector';
import { EventEmitter, IEventEmitter } from '../EventEmitter';
import { IRoot, TRootConfig } from './Root/Root';
import HorizontalRoot from './Root/HorizontalRoot';
import VerticalRoot from './Root/VerticalRoot';
import { ISlot, TSlotConfig } from './Slot/Slot';
import HorizontalSlot from './Slot/HorizontalSlot';
import VerticalSlot from './Slot/VerticalSlot';
import { IBar, TBarConfig } from './Bar/Bar';
import HorizontalBar from './Bar/HorizontalBar';
import VerticalBar from './Bar/VerticalBar';
import { IThumb, Thumb, TThumbConfig } from './Thumb';
import { ILabel, Label, TLabelConfig } from './Label';
import {
  TScaleConfig,
  Scale,
  TScaleCalcReasonableStep,
  IScale,
} from './Scale';
import { ISegment, Segment, TSegmentConfig } from './Segment';
import {
  IViewConfigurator,
  IViewHandler,
  IViewRender,
} from './IView';
import './my-jquery-slider.scss';

type TViewConfig = {
  min: number;
  max: number;
  values: number[];
  names: string[] | null;
  step: number;
  orientation: 'vertical' | 'horizontal';
  perValues: Array<number>;
  active: number;
  actualRanges: number[];
  list: Map<number, string>;
  withIndent: boolean;
  withLabel: boolean;
  label: 'number' | 'name';
  scale: 'basic' | 'numeric' | 'named' | 'mixed' | null;
  segments: number | null;
  withNotch: boolean | null;
  lengthPx: number | null;
};

class View implements IViewHandler, IViewConfigurator, IViewRender {
  private eventEmitter: IEventEmitter = new EventEmitter();

  private rootElem: HTMLElement;

  private root?: IRoot;

  private slot?: ISlot;

  private bars?: IBar[];

  private thumbs?: IThumb[];

  private labels?: ILabel[];

  private scale?: IScale;

  private segments?: ISegment[];

  private className = 'my-jquery-slider';

  private config: TViewConfig;

  private isProcessed = true;

  private selectedPerValue?: number;

  constructor(rootElem: HTMLElement, options?: TViewConfig) {
    this.rootElem = rootElem;
    this.config = { ...options as TViewConfig };
    this.bindEventListeners();
  }

  public on(event: string, callback: () => unknown): void {
    this.eventEmitter.subscribe(event, callback);
  }

  public render(options: TViewConfig): void {
    if (this.hasPartialChanges(options)) {
      this.config = this.isProcessed
        ? options
        : { ...options, perValues: this.config.perValues };
      this.reRender();
      return;
    }
    this.config = { ...options };
    this.selectedPerValue = this.config.perValues[this.config.active];
    this.makeSubViews();
    if (this.root) this.root.display();
    if (this.config.scale) this.addScaleBlock();
  }

  public getRootConfig(): TRootConfig {
    let indent: 'none' | 'more' | 'normal' = 'none';
    if (this.config.withIndent) {
      const isMore = ((this.config.withLabel
          && (!this.config.scale || this.config.orientation === 'vertical'))
        || (this.config.orientation === 'vertical'
          && this.config.scale && this.config.scale !== 'basic'));
      indent = isMore ? 'more' : 'normal';
    }
    const rootConfig: TRootConfig = {
      className: this.className,
      indent,
      lengthPx: this.config.lengthPx,
    };
    return rootConfig;
  }

  public getSlotConfig(): TSlotConfig {
    const slotConfig: TSlotConfig = {
      className: `${this.className}__slot`,
      withIndent: this.config.withIndent,
    };
    return slotConfig;
  }

  public getBarConfigs(): TBarConfig[] {
    const barConfigs: TBarConfig[] = [];
    let indentPer = 0;
    this.config.perValues.forEach((perValue, index) => {
      const barConfig: TBarConfig = {
        className: `${this.className}__bar`,
        id: index,
        lengthPer: perValue - indentPer,
        indentPer,
        isActive: index === this.config.active,
        isActual: this.config.actualRanges.indexOf(index) !== -1,
        isEven: (index + 1) % 2 === 0,
      };
      barConfigs.push(barConfig);
      indentPer = perValue;
    });
    return barConfigs;
  }

  public getThumbConfig(id: number): TThumbConfig {
    const thumbConfig: TThumbConfig = {
      className: `${this.className}__thumb`,
      id,
      withLabel: this.config.withLabel,
    };
    return thumbConfig;
  }

  public getLabelConfigs(): TLabelConfig[] {
    const labelConfigs: TLabelConfig[] = [];
    this.config.values.forEach((value, index) => {
      const names = this.config.names as string[];
      const isName = this.config.label === 'name' && names;
      labelConfigs.push({
        className: `${this.className}__label`,
        text: isName ? names[index] : value.toString(),
      });
    });
    return labelConfigs;
  }

  public getScaleConfig(): TScaleConfig {
    const scaleConfig: TScaleConfig = {
      className: `${this.className}__scale`,
      withIndent: this.config.withIndent,
    };
    return scaleConfig;
  }

  public getSegmentConfigs(
    calcReasonableStep: (options: TScaleCalcReasonableStep) => number,
  ): TSegmentConfig[] {
    const segmentConfig: TSegmentConfig = {
      className: `${this.className}__segment`,
      value: this.config.max,
      notch: 'short',
      label: this.defineSegmentLabel(this.config.max),
      grow: 1,
      isLast: true,
      withNotch: this.config.withNotch as boolean,
    };
    const segmentConfigs: TSegmentConfig[] = [];
    const reasonableStep = calcReasonableStep({
      min: this.config.min,
      max: this.config.max,
      step: this.config.step,
      maxLengthPx: this.root
        ? this.root.calcContentLengthPx() as number
        : this.config.lengthPx as number,
      isVertical: this.config.orientation === 'vertical',
      type: this.config.scale as 'basic' | 'numeric' | 'named' | 'mixed',
      count: this.config.segments as number,
    }) ?? this.config.step;
    let acc;
    for (
      acc = this.config.min;
      acc <= this.config.max;
      acc += reasonableStep
    ) {
      acc = Corrector.makeCorrecterValueTailBy(reasonableStep)(acc);
      segmentConfigs.push({
        ...segmentConfig,
        value: acc,
        notch: acc % (10 * reasonableStep) === 0 ? 'long' : 'normal',
        label: this.defineSegmentLabel(acc),
        grow:
          acc + reasonableStep > this.config.max
            ? this.config.max - acc
            : reasonableStep,
        isLast: acc === this.config.max,
      });
    }
    if (acc - reasonableStep !== this.config.max) {
      segmentConfigs.pop();
      segmentConfigs.push({
        ...segmentConfig,
        grow: this.config.max - (acc - reasonableStep),
      });
    }
    return segmentConfigs;
  }

  public handleSelectRange(index: number): void {
    if (!this.isProcessed) return;
    this.isProcessed = false;
    this.notify('change-active', index);
  }

  public handleSelectValue(value: number): void {
    this.notify('change-active-close', value);
    this.notify('change-value', value);
  }

  public handleSelectPerValue(perValue: number): void {
    this.selectedPerValue = perValue;
    this.notify('change-per-value', this.selectedPerValue);
  }

  public handleStepForward(): void {
    this.notify('forward');
  }

  public handleStepBackward(): void {
    this.notify('backward');
  }

  public handleFocus(index: number): void {
    this.notify('change-active', index);
  }

  private handleRelease() {
    if (this.isProcessed) return;
    this.isProcessed = true;
    this.notify('change');
  }

  private handleResize() {
    this.reRender();
  }

  private notify(event: string, value?: number): void {
    const args: [string, number?] = [event];
    const hasValue = value || value === 0;
    if (hasValue) args.push(value);
    this.eventEmitter.emit(...args);
  }

  private hasPartialChanges(options: TViewConfig) {
    return (this.root
      && (!options
        || (this.config.orientation === options.orientation
          && this.config.perValues.length === options.perValues.length
          && this.config.scale === options.scale
          && this.config.segments === options.segments)
      )
    );
  }

  private reRender() {
    if (Object.keys(this.config).length === 0) return;
    if (!this.isProcessed) {
      this.correctPerValues();
    }
    this.updateSubViews();
    const isNeedToAddScale = this.config.scale && this.isProcessed;
    if (isNeedToAddScale) this.addScaleBlock();
  }

  private makeSubViews() {
    this.labels = this.getLabelConfigs().map(
      (labelConfig) => new Label(labelConfig),
    );
    this.thumbs = this.config.perValues.map((_, index) => {
      const labels = this.labels as ILabel[];
      return new Thumb(labels[index], this, this.getThumbConfig(index));
    });
    if (this.config.orientation === 'vertical') {
      this.bars = this.getBarConfigs().map((barConfig, index) => {
        const thumbs = this.thumbs as IThumb[];
        return new VerticalBar(thumbs[index], barConfig);
      });
      this.slot = new VerticalSlot(
        this.bars,
        this,
        this.getSlotConfig(),
      );
      this.root = new VerticalRoot(
        this.rootElem,
        this.slot,
        this.getRootConfig(),
      );
    } else {
      this.bars = this.getBarConfigs().map((barConfig, index) => {
        const thumbs = this.thumbs as IThumb[];
        return new HorizontalBar(thumbs[index], barConfig);
      });
      this.slot = new HorizontalSlot(
        this.bars,
        this,
        this.getSlotConfig(),
      );
      this.root = new HorizontalRoot(
        this.rootElem,
        this.slot,
        this.getRootConfig(),
      );
    }
  }

  private addScaleBlock() {
    this.scale = new Scale(this.getScaleConfig());
    this.segments = this.getSegmentConfigs(
      Scale.calcReasonableStep,
    ).map((segmentConfig) => new Segment(this, segmentConfig));
    this.scale.setSegments(this.segments);
    if (this.root) {
      this.root.setScale(this.scale);
      this.root.display(true);
    }
  }

  private updateSubViews() {
    this.getLabelConfigs().forEach((labelConfig, index) => {
      const labels = this.labels as ILabel[];
      labels[index].update(labelConfig);
    });
    this.getBarConfigs().forEach((barConfig, index) => {
      const thumb = this.thumbs as IThumb[];
      const bars = this.bars as IBar[];
      thumb[index].update(this.getThumbConfig(index));
      bars[index].update(barConfig);
    });
    if (this.slot) this.slot.update(this.getSlotConfig());
    const isNeedToUpdateScale = this.scale
      && this.segments && this.segments.length;
    if (isNeedToUpdateScale) {
      this.getSegmentConfigs(Scale.calcReasonableStep).forEach(
        (segmentConfig, index) => {
          this.updateSegment(index, segmentConfig);
        },
      );
      if (this.scale) this.scale.update(this.getScaleConfig());
    }
    if (this.root) this.root.update(this.getRootConfig());
  }

  private updateSegment(
    index: number,
    segmentConfig: TSegmentConfig,
  ) {
    const segments = this.segments as Segment[];
    if (segments[index]) {
      segments[index].update(segmentConfig);
    } else segments[index] = new Segment(this, segmentConfig);
  }

  private correctPerValues() {
    const { active } = this.config;
    const prev = this.config.perValues[active - 1];
    const next = this.config.perValues[active + 1];
    const isFirst = this.config.active - 1 < 0;
    const { length } = this.config.perValues;
    const isLast = this.config.active + 1 >= length;
    if (!(this.selectedPerValue || this.selectedPerValue === 0)) return;
    const isMoreThenPrev = this.selectedPerValue >= prev;
    const isLessThenMin = this.selectedPerValue <= 0;
    const isLessThenNext = this.selectedPerValue <= next;
    const isMoreThenMax = this.selectedPerValue >= 100;

    let value;
    const isOne = isFirst && isLast;
    if (isOne) {
      value = this.defineOneRangeValue(isLessThenMin, isMoreThenMax);
    } else if (isFirst) {
      value = this.defineFirstRangeValue(
        isLessThenMin,
        isLessThenNext,
        next,
      );
    } else if (isLast) {
      value = this.defineLastRangeValue(
        isMoreThenMax,
        isMoreThenPrev,
        prev,
      );
    } else if (isLessThenNext) {
      value = isMoreThenPrev ? this.selectedPerValue : prev;
    } else {
      value = next;
    }
    this.config.perValues[active] = value as number;
  }

  private defineOneRangeValue(
    isLessThenMin: boolean,
    isMoreThenMax: boolean,
  ) {
    if (isLessThenMin) return 0;
    return isMoreThenMax ? 100 : this.selectedPerValue;
  }

  private defineFirstRangeValue(
    isLessThenMin: boolean,
    isLessThenNext: boolean,
    next: number,
  ) {
    if (isLessThenMin) return 0;
    return isLessThenNext ? this.selectedPerValue : next;
  }

  private defineLastRangeValue(
    isMoreThenMax: boolean,
    isMoreThenPrev: boolean,
    prev: number,
  ) {
    if (isMoreThenMax) return 100;
    return isMoreThenPrev ? this.selectedPerValue : prev;
  }

  private bindEventListeners() {
    document.addEventListener(
      'pointerup',
      this.handleRelease.bind(this),
    );
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  private defineSegmentLabel(value: number): number | string {
    let label = null;
    if (this.config.scale === 'numeric') {
      label = value;
    } else if (this.config.scale !== 'basic') {
      label = this.config.list.get(value)
        ?? (this.config.scale === 'mixed' ? value : null);
    }
    return label as number | string;
  }
}

export { View, TViewConfig };
