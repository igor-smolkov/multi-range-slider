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
  private _eventEmitter: IEventEmitter = new EventEmitter();

  private _rootElem: HTMLElement;

  private _root?: IRoot;

  private _slot?: ISlot;

  private _bars?: IBar[];

  private _thumbs?: IThumb[];

  private _labels?: ILabel[];

  private _scale?: IScale;

  private _segments?: ISegment[];

  private _className = 'my-jquery-slider';

  private _config: TViewConfig;

  private _isProcessed = true;

  private _selectedPerValue?: number;

  constructor(rootElem: HTMLElement, options?: TViewConfig) {
    this._rootElem = rootElem;
    this._config = { ...options as TViewConfig };
    this._bindEventListeners();
  }

  public on(event: string, callback: () => unknown): void {
    this._eventEmitter.subscribe(event, callback);
  }

  public render(options: TViewConfig): void {
    if (this._hasPartialChanges(options)) {
      this._config = this._isProcessed
        ? options
        : { ...options, perValues: this._config.perValues };
      this._reRender();
      return;
    }
    this._config = { ...options };
    this._selectedPerValue = this._config.perValues[this._config.active];
    this._makeSubViews();
    if (this._root) this._root.display();
    if (this._config.scale) this._addScaleBlock();
  }

  public getRootConfig(): TRootConfig {
    let indent: 'none' | 'more' | 'normal' = 'none';
    if (this._config.withIndent) {
      const isMore = ((this._config.withLabel
          && (!this._config.scale || this._config.orientation === 'vertical'))
        || (this._config.orientation === 'vertical'
          && this._config.scale && this._config.scale !== 'basic'));
      indent = isMore ? 'more' : 'normal';
    }
    const rootConfig: TRootConfig = {
      className: this._className,
      indent,
      lengthPx: this._config.lengthPx,
    };
    return rootConfig;
  }

  public getSlotConfig(): TSlotConfig {
    const slotConfig: TSlotConfig = {
      className: `${this._className}__slot`,
      withIndent: this._config.withIndent,
    };
    return slotConfig;
  }

  public getBarConfigs(): TBarConfig[] {
    const barConfigs: TBarConfig[] = [];
    let indentPer = 0;
    this._config.perValues.forEach((perValue, index) => {
      const barConfig: TBarConfig = {
        className: `${this._className}__bar`,
        id: index,
        lengthPer: perValue - indentPer,
        indentPer,
        isActive: index === this._config.active,
        isActual: this._config.actualRanges.indexOf(index) !== -1,
        isEven: (index + 1) % 2 === 0,
      };
      barConfigs.push(barConfig);
      indentPer = perValue;
    });
    return barConfigs;
  }

  public getThumbConfig(id: number): TThumbConfig {
    const thumbConfig: TThumbConfig = {
      className: `${this._className}__thumb`,
      id,
      withLabel: this._config.withLabel,
    };
    return thumbConfig;
  }

  public getLabelConfigs(): TLabelConfig[] {
    const labelConfigs: TLabelConfig[] = [];
    this._config.values.forEach((value, index) => {
      const names = this._config.names as string[];
      const isName = this._config.label === 'name' && names;
      labelConfigs.push({
        className: `${this._className}__label`,
        text: isName ? names[index] : value.toString(),
      });
    });
    return labelConfigs;
  }

  public getScaleConfig(): TScaleConfig {
    const scaleConfig: TScaleConfig = {
      className: `${this._className}__scale`,
      withIndent: this._config.withIndent,
    };
    return scaleConfig;
  }

  public getSegmentConfigs(
    calcReasonableStep: (options: TScaleCalcReasonableStep) => number,
  ): TSegmentConfig[] {
    const segmentConfig: TSegmentConfig = {
      className: `${this._className}__segment`,
      value: this._config.max,
      notch: 'short',
      label: this._defineSegmentLabel(this._config.max),
      grow: 1,
      isLast: true,
      withNotch: this._config.withNotch as boolean,
    };
    const segmentConfigs: TSegmentConfig[] = [];
    const reasonableStep = calcReasonableStep({
      min: this._config.min,
      max: this._config.max,
      step: this._config.step,
      maxLengthPx: this._root
        ? this._root.calcContentLengthPx() as number
        : this._config.lengthPx as number,
      isVertical: this._config.orientation === 'vertical',
      type: this._config.scale as 'basic' | 'numeric' | 'named' | 'mixed',
      count: this._config.segments as number,
    }) ?? this._config.step;
    let acc;
    for (
      acc = this._config.min;
      acc <= this._config.max;
      acc += reasonableStep
    ) {
      acc = Corrector.makeCorrecterValueTailBy(reasonableStep)(acc);
      segmentConfigs.push({
        ...segmentConfig,
        value: acc,
        notch: acc % (10 * reasonableStep) === 0 ? 'long' : 'normal',
        label: this._defineSegmentLabel(acc),
        grow:
          acc + reasonableStep > this._config.max
            ? this._config.max - acc
            : reasonableStep,
        isLast: acc === this._config.max,
      });
    }
    if (acc - reasonableStep !== this._config.max) {
      segmentConfigs.pop();
      segmentConfigs.push({
        ...segmentConfig,
        grow: this._config.max - (acc - reasonableStep),
      });
    }
    return segmentConfigs;
  }

  public handleSelectRange(index: number): void {
    if (!this._isProcessed) return;
    this._isProcessed = false;
    this._notify('change-active', index);
  }

  public handleSelectValue(value: number): void {
    this._notify('change-active-close', value);
    this._notify('change-value', value);
  }

  public handleSelectPerValue(perValue: number): void {
    this._selectedPerValue = perValue;
    this._notify('change-per-value', this._selectedPerValue);
  }

  public handleStepForward(): void {
    this._notify('forward');
  }

  public handleStepBackward(): void {
    this._notify('backward');
  }

  public handleFocus(index: number): void {
    this._notify('change-active', index);
  }

  private _handleRelease() {
    if (this._isProcessed) return;
    this._isProcessed = true;
    this._notify('change');
  }

  private _handleResize() {
    this._reRender();
  }

  private _notify(event: string, value?: number): void {
    const args: [string, number?] = [event];
    const hasValue = value || value === 0;
    if (hasValue) args.push(value);
    this._eventEmitter.emit(...args);
  }

  private _hasPartialChanges(options: TViewConfig) {
    return (this._root
      && (!options
        || (this._config.orientation === options.orientation
          && this._config.perValues.length === options.perValues.length
          && this._config.scale === options.scale
          && this._config.segments === options.segments)
      )
    );
  }

  private _reRender() {
    if (Object.keys(this._config).length === 0) return;
    if (!this._isProcessed) {
      this._correctPerValues();
    }
    this._updateSubViews();
    const isNeedToAddScale = this._config.scale && this._isProcessed;
    if (isNeedToAddScale) this._addScaleBlock();
  }

  private _makeSubViews() {
    this._labels = this.getLabelConfigs().map(
      (labelConfig) => new Label(labelConfig),
    );
    this._thumbs = this._config.perValues.map((_, index) => {
      const labels = this._labels as ILabel[];
      return new Thumb(labels[index], this, this.getThumbConfig(index));
    });
    if (this._config.orientation === 'vertical') {
      this._bars = this.getBarConfigs().map((barConfig, index) => {
        const thumbs = this._thumbs as IThumb[];
        return new VerticalBar(thumbs[index], barConfig);
      });
      this._slot = new VerticalSlot(
        this._bars,
        this,
        this.getSlotConfig(),
      );
      this._root = new VerticalRoot(
        this._rootElem,
        this._slot,
        this.getRootConfig(),
      );
    } else {
      this._bars = this.getBarConfigs().map((barConfig, index) => {
        const thumbs = this._thumbs as IThumb[];
        return new HorizontalBar(thumbs[index], barConfig);
      });
      this._slot = new HorizontalSlot(
        this._bars,
        this,
        this.getSlotConfig(),
      );
      this._root = new HorizontalRoot(
        this._rootElem,
        this._slot,
        this.getRootConfig(),
      );
    }
  }

  private _addScaleBlock() {
    this._scale = new Scale(this.getScaleConfig());
    this._segments = this.getSegmentConfigs(
      Scale.calcReasonableStep,
    ).map((segmentConfig) => new Segment(this, segmentConfig));
    this._scale.setSegments(this._segments);
    if (this._root) {
      this._root.setScale(this._scale);
      this._root.display(true);
    }
  }

  private _updateSubViews() {
    this.getLabelConfigs().forEach((labelConfig, index) => {
      const labels = this._labels as ILabel[];
      labels[index].update(labelConfig);
    });
    this.getBarConfigs().forEach((barConfig, index) => {
      const thumb = this._thumbs as IThumb[];
      const bars = this._bars as IBar[];
      thumb[index].update(this.getThumbConfig(index));
      bars[index].update(barConfig);
    });
    if (this._slot) this._slot.update(this.getSlotConfig());
    const isNeedToUpdateScale = this._scale
      && this._segments && this._segments.length;
    if (isNeedToUpdateScale) {
      this.getSegmentConfigs(Scale.calcReasonableStep).forEach(
        (segmentConfig, index) => {
          this._updateSegment(index, segmentConfig);
        },
      );
      if (this._scale) this._scale.update(this.getScaleConfig());
    }
    if (this._root) this._root.update(this.getRootConfig());
  }

  private _updateSegment(
    index: number,
    segmentConfig: TSegmentConfig,
  ) {
    const segments = this._segments as Segment[];
    if (segments[index]) {
      segments[index].update(segmentConfig);
    } else segments[index] = new Segment(this, segmentConfig);
  }

  private _correctPerValues() {
    const { active } = this._config;
    const prev = this._config.perValues[active - 1];
    const next = this._config.perValues[active + 1];
    const isFirst = this._config.active - 1 < 0;
    const { length } = this._config.perValues;
    const isLast = this._config.active + 1 >= length;
    if (!(this._selectedPerValue || this._selectedPerValue === 0)) return;
    const isMoreThenPrev = this._selectedPerValue >= prev;
    const isLessThenMin = this._selectedPerValue <= 0;
    const isLessThenNext = this._selectedPerValue <= next;
    const isMoreThenMax = this._selectedPerValue >= 100;

    let value;
    const isOne = isFirst && isLast;
    if (isOne) {
      value = this._defineOneRangeValue(isLessThenMin, isMoreThenMax);
    } else if (isFirst) {
      value = this._defineFirstRangeValue(
        isLessThenMin,
        isLessThenNext,
        next,
      );
    } else if (isLast) {
      value = this._defineLastRangeValue(
        isMoreThenMax,
        isMoreThenPrev,
        prev,
      );
    } else if (isLessThenNext) {
      value = isMoreThenPrev ? this._selectedPerValue : prev;
    } else {
      value = next;
    }
    this._config.perValues[active] = value as number;
  }

  private _defineOneRangeValue(
    isLessThenMin: boolean,
    isMoreThenMax: boolean,
  ) {
    if (isLessThenMin) return 0;
    return isMoreThenMax ? 100 : this._selectedPerValue;
  }

  private _defineFirstRangeValue(
    isLessThenMin: boolean,
    isLessThenNext: boolean,
    next: number,
  ) {
    if (isLessThenMin) return 0;
    return isLessThenNext ? this._selectedPerValue : next;
  }

  private _defineLastRangeValue(
    isMoreThenMax: boolean,
    isMoreThenPrev: boolean,
    prev: number,
  ) {
    if (isMoreThenMax) return 100;
    return isMoreThenPrev ? this._selectedPerValue : prev;
  }

  private _bindEventListeners() {
    document.addEventListener(
      'pointerup',
      this._handleRelease.bind(this),
    );
    window.addEventListener('resize', this._handleResize.bind(this));
  }

  private _defineSegmentLabel(value: number): number | string {
    let label = null;
    if (this._config.scale === 'numeric') {
      label = value;
    } else if (this._config.scale !== 'basic') {
      label = this._config.list.get(value)
        ?? (this._config.scale === 'mixed' ? value : null);
    }
    return label as number | string;
  }
}

export { View, TViewConfig };
