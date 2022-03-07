import Corrector from '../Corrector';
import { EventEmitter, IEventEmitter } from '../EventEmitter';
import {
  SliderLabel, SliderOrientation, SliderScale,
} from '../TMyJQuerySlider';
import { IRoot, RootIndent, TRootConfig } from './Root/Root';
import HorizontalRoot from './Root/HorizontalRoot';
import VerticalRoot from './Root/VerticalRoot';
import { IBarsSlot, TBarsSlotConfig } from './BarsSlot/BarsSlot';
import HorizontalBarsSlot from './BarsSlot/HorizontalBarsSlot';
import VerticalBarsSlot from './BarsSlot/VerticalBarsSlot';
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
import {
  IScaleSegment, ScaleSegment, ScaleSegmentNotch, TScaleSegmentConfig,
} from './ScaleSegment';
import {
  IViewConfigurator,
  IViewHandler,
  IViewRender,
} from './IView';
import './my-jquery-slider.scss';

enum ViewEvent {
  change = 'change',
  changeActiveRange = 'change-active-range',
  changeActiveRangeClose = 'change-active-range-close',
  changeValue = 'change-value',
  changePerValue = 'change-per-value',
  forward = 'forward',
  backward = 'backward',
}

type TViewConfig = {
  min: number;
  max: number;
  values: number[];
  names: string[] | null;
  step: number;
  orientation: SliderOrientation;
  perValues: Array<number>;
  activeRange: number;
  actualRanges: number[];
  labelsList: Map<number, string>;
  withIndent: boolean;
  withLabel: boolean;
  label: SliderLabel;
  scale: SliderScale | null;
  scaleSegments: number | null;
  withNotch: boolean | null;
  lengthPx: number | null;
};

class View implements IViewHandler, IViewConfigurator, IViewRender {
  private static className = 'my-jquery-slider';

  private eventEmitter: IEventEmitter = new EventEmitter();

  private rootElem: HTMLElement;

  private root?: IRoot;

  private barsSlot?: IBarsSlot;

  private bars?: IBar[];

  private thumbs?: IThumb[];

  private labels?: ILabel[];

  private scale?: IScale;

  private scaleSegments?: IScaleSegment[];

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
    this.selectedPerValue = this.config.perValues[this.config.activeRange];
    this.makeSubViews();
    if (this.root) this.root.display();
    if (this.config.scale) this.addScaleBlock();
  }

  public getRootConfig(): TRootConfig {
    let indent: RootIndent = RootIndent.none;
    if (this.config.withIndent) {
      const isMore = ((this.config.withLabel
          && (!this.config.scale
            || this.config.orientation === SliderOrientation.vertical))
        || (this.config.orientation === SliderOrientation.vertical
          && this.config.scale && this.config.scale !== SliderScale.basic));
      indent = isMore ? RootIndent.more : RootIndent.normal;
    }
    const rootConfig: TRootConfig = {
      className: View.className,
      indent,
      lengthPx: this.config.lengthPx,
    };
    return rootConfig;
  }

  public getBarsSlotConfig(): TBarsSlotConfig {
    const barsSlotConfig: TBarsSlotConfig = {
      className: `${View.className}__bars-slot`,
      withIndent: this.config.withIndent,
    };
    return barsSlotConfig;
  }

  public getBarConfigs(): TBarConfig[] {
    const barConfigs: TBarConfig[] = [];
    let indentPer = 0;
    this.config.perValues.forEach((perValue, index) => {
      const barConfig: TBarConfig = {
        className: `${View.className}__bar`,
        id: index,
        lengthPer: perValue - indentPer,
        indentPer,
        isActive: index === this.config.activeRange,
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
      className: `${View.className}__thumb`,
      id,
      withLabel: this.config.withLabel,
    };
    return thumbConfig;
  }

  public getLabelConfigs(): TLabelConfig[] {
    const labelConfigs: TLabelConfig[] = [];
    this.config.values.forEach((value, index) => {
      const names = this.config.names as string[];
      const isName = this.config.label === SliderLabel.name && names;
      labelConfigs.push({
        className: `${View.className}__label`,
        text: isName ? names[index] : value.toString(),
      });
    });
    return labelConfigs;
  }

  public getScaleConfig(): TScaleConfig {
    const scaleConfig: TScaleConfig = {
      className: `${View.className}__scale`,
      withIndent: this.config.withIndent,
    };
    return scaleConfig;
  }

  public getScaleSegmentConfigs(
    calcReasonableStep: (options: TScaleCalcReasonableStep) => number,
  ): TScaleSegmentConfig[] {
    const scaleSegmentConfig: TScaleSegmentConfig = {
      className: `${View.className}__scale-segment`,
      value: this.config.max,
      notch: ScaleSegmentNotch.short,
      label: this.defineScaleSegmentLabel(this.config.max),
      grow: 1,
      isLast: true,
      withNotch: this.config.withNotch as boolean,
    };
    const scaleSegmentConfigs: TScaleSegmentConfig[] = [];
    const reasonableStep = calcReasonableStep({
      min: this.config.min,
      max: this.config.max,
      step: this.config.step,
      maxLengthPx: this.root
        ? this.root.calcContentLengthPx() as number
        : this.config.lengthPx as number,
      isVertical: this.config.orientation === SliderOrientation.vertical,
      type: this.config.scale as SliderScale,
      count: this.config.scaleSegments as number,
    }) ?? this.config.step;
    const mantissaLength = Corrector.getMaxMantissaLength(
      this.config.min,
      reasonableStep,
      this.config.max,
    );
    let acc;
    for (
      acc = this.config.min;
      acc <= this.config.max;
      acc += reasonableStep
    ) {
      acc = Corrector.correctValueTail(acc, mantissaLength);
      scaleSegmentConfigs.push({
        ...scaleSegmentConfig,
        value: acc,
        notch: acc % (10 * reasonableStep) === 0
          ? ScaleSegmentNotch.long : ScaleSegmentNotch.normal,
        label: this.defineScaleSegmentLabel(acc),
        grow: this.defineScaleSegmentGrow(acc, reasonableStep, mantissaLength),
        isLast: acc === this.config.max,
      });
    }
    if (acc - reasonableStep !== this.config.max) {
      scaleSegmentConfigs.pop();
      scaleSegmentConfigs.push({
        ...scaleSegmentConfig,
        grow: this.defineScaleSegmentGrow(acc, reasonableStep, mantissaLength, true),
      });
    }
    return scaleSegmentConfigs;
  }

  public handleSelectRange(index: number): void {
    if (!this.isProcessed) return;
    this.isProcessed = false;
    this.notify(ViewEvent.changeActiveRange, index);
  }

  public handleSelectValue(value: number): void {
    this.notify(ViewEvent.changeActiveRangeClose, value);
    this.notify(ViewEvent.changeValue, value);
  }

  public handleSelectPerValue(perValue: number): void {
    this.selectedPerValue = perValue;
    this.notify(ViewEvent.changePerValue, this.selectedPerValue);
  }

  public handleStepForward(): void {
    this.notify(ViewEvent.forward);
  }

  public handleStepBackward(): void {
    this.notify(ViewEvent.backward);
  }

  public handleFocus(index: number): void {
    this.notify(ViewEvent.changeActiveRange, index);
  }

  private handleRelease() {
    if (this.isProcessed) return;
    this.isProcessed = true;
    this.notify(ViewEvent.change);
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
          && this.config.scaleSegments === options.scaleSegments)
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
    if (this.config.orientation === SliderOrientation.vertical) {
      this.bars = this.getBarConfigs().map((barConfig, index) => {
        const thumbs = this.thumbs as IThumb[];
        return new VerticalBar(thumbs[index], barConfig);
      });
      this.barsSlot = new VerticalBarsSlot(
        this.bars,
        this,
        this.getBarsSlotConfig(),
      );
      this.root = new VerticalRoot(
        this.rootElem,
        this.barsSlot,
        this.getRootConfig(),
      );
    } else {
      this.bars = this.getBarConfigs().map((barConfig, index) => {
        const thumbs = this.thumbs as IThumb[];
        return new HorizontalBar(thumbs[index], barConfig);
      });
      this.barsSlot = new HorizontalBarsSlot(
        this.bars,
        this,
        this.getBarsSlotConfig(),
      );
      this.root = new HorizontalRoot(
        this.rootElem,
        this.barsSlot,
        this.getRootConfig(),
      );
    }
  }

  private addScaleBlock() {
    this.scale = new Scale(this.getScaleConfig());
    this.scaleSegments = this.getScaleSegmentConfigs(
      Scale.calcReasonableStep,
    ).map((scaleSegmentConfig) => new ScaleSegment(this, scaleSegmentConfig));
    this.scale.setScaleSegments(this.scaleSegments);
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
    if (this.barsSlot) this.barsSlot.update(this.getBarsSlotConfig());
    const isNeedToUpdateScale = this.scale
      && this.scaleSegments && this.scaleSegments.length;
    if (isNeedToUpdateScale) {
      this.getScaleSegmentConfigs(Scale.calcReasonableStep).forEach(
        (scaleSegmentConfig, index) => {
          this.updateScaleSegment(index, scaleSegmentConfig);
        },
      );
      if (this.scale) this.scale.update(this.getScaleConfig());
    }
    if (this.root) this.root.update(this.getRootConfig());
  }

  private updateScaleSegment(
    index: number,
    scaleSegmentConfig: TScaleSegmentConfig,
  ) {
    const scaleSegments = this.scaleSegments as ScaleSegment[];
    if (scaleSegments[index]) {
      scaleSegments[index].update(scaleSegmentConfig);
    } else scaleSegments[index] = new ScaleSegment(this, scaleSegmentConfig);
  }

  private correctPerValues() {
    const { activeRange } = this.config;
    const prev = this.config.perValues[activeRange - 1];
    const next = this.config.perValues[activeRange + 1];
    const isFirst = this.config.activeRange - 1 < 0;
    const { length } = this.config.perValues;
    const isLast = this.config.activeRange + 1 >= length;
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
    this.config.perValues[activeRange] = value as number;
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

  private defineScaleSegmentLabel(value: number): number | string {
    let label = null;
    if (this.config.scale === SliderScale.numeric) {
      label = value;
    } else if (this.config.scale !== SliderScale.basic) {
      label = this.config.labelsList.get(value)
        ?? (this.config.scale === SliderScale.mixed ? value : null);
    }
    return label as number | string;
  }

  private defineScaleSegmentGrow(
    beforeSum: number,
    step: number,
    mantissaLength: number,
    isLast?: boolean,
  ) {
    const { max } = this.config;
    let grow = (beforeSum + step > max ? max - beforeSum : step);
    if (isLast) { grow = max - (beforeSum - step); }
    return Corrector.correctValueTail(grow * 10 ** mantissaLength, mantissaLength);
  }
}

export { View, TViewConfig, ViewEvent };
