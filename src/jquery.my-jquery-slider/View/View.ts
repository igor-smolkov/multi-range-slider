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
  TScaleConfig, Scale, TScaleCalcReasonableStep, IScale,
} from './Scale';
import { ISegment, Segment, TSegmentConfig } from './Segment';
import { IViewConfigurator, IViewHandler, IViewRender } from './IView';
import './my-jquery-slider.scss';

type TViewConfig = {
  min: number;
  max: number;
  values: number[];
  names: string[];
  step: number;
  orientation: 'vertical' | 'horizontal';
  perValues: Array<number>;
  active: number;
  actualRanges: number[];
  list: Map<number, string>;
  withIndent: boolean;
  withLabel: boolean;
  label: 'number' | 'name';
  scale: 'basic' | 'numeric' | 'named' | 'mixed';
  segments: number;
  withNotch: boolean;
  lengthPx: number;
}

class View implements IViewHandler, IViewConfigurator, IViewRender {
  private _eventEmitter: IEventEmitter;

  private _rootElem: HTMLElement;

  private _root: IRoot;

  private _slot: ISlot;

  private _bars: IBar[];

  private _thumbs: IThumb[];

  private _labels: ILabel[];

  private _scale: IScale;

  private _segments: ISegment[];

  private _className: string;

  private _config: TViewConfig;

  private _isProcessed: boolean;

  private _selectedPerValue: number;

  constructor(rootElem: HTMLElement, options?: TViewConfig) {
    this._eventEmitter = new EventEmitter();
    this._rootElem = rootElem;
    this._config = options;
    this._className = 'my-jquery-slider';
    this._isProcessed = true;
    this._bindEventListeners();
  }

  public on(event: string, callback: ()=>unknown): void {
    this._eventEmitter.subscribe(event, callback);
  }

  public render(options: TViewConfig): void {
    if (this._hasPartialChanges(options)) {
      this._config = this._isProcessed
        ? options : { ...options, perValues: this._config.perValues };
      const isCriticalScaleChanges = this._config.scale || this._config.segments;
      if (isCriticalScaleChanges && this._isProcessed) this._addScaleBlock();
      this._reRender();
      return;
    }
    this._config = options;
    this._selectedPerValue = this._config.perValues[this._config.active];
    this._makeSubViews();
    this._root.display();
    if (this._config.scale) this._addScaleBlock();
  }

  public getRootConfig(): TRootConfig {
    let indent: 'none' | 'more' | 'normal' = 'none';
    if (this._config.withIndent) {
      indent = ((this._config.withLabel && (!this._config.scale || this._config.orientation === 'vertical'))
        || (this._config.orientation === 'vertical' && this._config.scale && this._config.scale !== 'basic')) ? 'more' : 'normal';
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

  public getThumbConfig(id = 0): TThumbConfig {
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
      labelConfigs.push({
        className: `${this._className}__label`,
        text: this._config.label === 'name' && this._config.names
          ? this._config.names[index] : value.toString(),
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
    calcReasonableStep:(options: TScaleCalcReasonableStep) => number,
  ): TSegmentConfig[] {
    const segmentConfigs: TSegmentConfig[] = [];
    const reasonableStep = calcReasonableStep({
      min: this._config.min,
      max: this._config.max,
      step: this._config.step,
      maxLengthPx: this._root ? this._root.calcContentLengthPx() : this._config.lengthPx,
      isVertical: this._config.orientation === 'vertical',
      type: this._config.scale,
      count: this._config.segments,
    }) ?? this._config.step;
    let acc;
    for (acc = this._config.min; acc <= this._config.max; acc += reasonableStep) {
      acc = Corrector.makeCorrecterValueTailBy(reasonableStep)(acc);
      const name = this._config.list.get(acc) ?? (this._config.scale === 'mixed' ? acc : null);
      const label = this._config.scale !== 'numeric' ? name : acc;
      segmentConfigs.push({
        className: `${this._className}__segment`,
        value: acc,
        notch: acc % (10 * reasonableStep) === 0 ? 'long' : 'normal',
        label: this._config.scale !== 'basic' ? label : null,
        grow: (acc + reasonableStep > this._config.max) ? (this._config.max - acc) : reasonableStep,
        isLast: acc === this._config.max,
        withNotch: this._config.withNotch,
      });
    }
    if (acc - reasonableStep !== this._config.max) {
      segmentConfigs.pop();
      const name = this._config.list.get(this._config.max) ?? (this._config.scale === 'mixed' ? this._config.max : null);
      const label = this._config.scale !== 'numeric' ? name : this._config.max;
      segmentConfigs.push({
        className: `${this._className}__segment`,
        value: this._config.max,
        label: this._config.scale !== 'basic' ? label : null,
        notch: 'short',
        grow: this._config.max - (acc - reasonableStep),
        isLast: true,
        withNotch: this._config.withNotch,
      });
    }
    return segmentConfigs;
  }

  public handleSelectRange(index: number): void {
    if (!this._isProcessed) return;
    this._isProcessed = false;
    this._notify('change-active', index);
  }

  public handleSelectValue(value :number): void {
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
    if (value || value === 0) args.push(value);
    this._eventEmitter.emit(...args);
  }

  private _hasPartialChanges(options: TViewConfig) {
    return this._root && (!options || (
      this._config.orientation === options.orientation
      && this._config.perValues.length === options.perValues.length
    ));
  }

  private _reRender() {
    if (!this._isProcessed) { this._correctPerValues(); }
    this._updateSubViews();
  }

  private _makeSubViews() {
    this._labels = this.getLabelConfigs().map((labelConfig) => new Label(labelConfig));
    this._thumbs = this._config.perValues.map(
      (_, index) => new Thumb(this._labels[index], this, this.getThumbConfig(index)),
    );
    if (this._config.orientation === 'vertical') {
      this._bars = this.getBarConfigs().map(
        (barConfig, index) => new VerticalBar(this._thumbs[index], barConfig),
      );
      this._slot = new VerticalSlot(this._bars, this, this.getSlotConfig());
      this._root = new VerticalRoot(this._rootElem, this._slot, this.getRootConfig());
    } else {
      this._bars = this.getBarConfigs().map(
        (barConfig, index) => new HorizontalBar(this._thumbs[index], barConfig),
      );
      this._slot = new HorizontalSlot(this._bars, this, this.getSlotConfig());
      this._root = new HorizontalRoot(this._rootElem, this._slot, this.getRootConfig());
    }
  }

  private _addScaleBlock() {
    this._scale = new Scale(this.getScaleConfig());
    this._segments = this.getSegmentConfigs(Scale.calcReasonableStep).map(
      (segmentConfig) => new Segment(this, segmentConfig),
    );
    this._scale.setSegments(this._segments);
    this._root.setScale(this._scale);
    this._root.display();
  }

  private _updateSubViews() {
    this.getLabelConfigs().forEach((labelConfig, index) => {
      this._labels[index].update(labelConfig);
    });
    this.getBarConfigs().forEach((barConfig, index) => {
      this._thumbs[index].update(this.getThumbConfig(index));
      this._bars[index].update(barConfig);
    });
    this._slot.update(this.getSlotConfig());
    if (this._scale && this._segments.length) {
      this.getSegmentConfigs(Scale.calcReasonableStep).forEach((segmentConfig, index) => {
        if (this._segments[index]) this._segments[index].update(segmentConfig);
        else this._segments[index] = new Segment(this, segmentConfig);
      });
      this._scale.update(this.getScaleConfig());
    }
    this._root.update(this.getRootConfig());
  }

  private _correctPerValues() {
    const { active } = this._config;
    const prev = this._config.perValues[active - 1];
    const next = this._config.perValues[active + 1];
    const isFirst = this._config.active - 1 < 0;
    const isMoreThenPrev = this._selectedPerValue >= prev;
    const isLessThenMin = this._selectedPerValue <= 0;
    const isLast = this._config.active + 1 >= this._config.perValues.length;
    const isLessThenNext = this._selectedPerValue <= next;
    const isMoreThenMax = this._selectedPerValue >= 100;

    let value;
    if (isFirst && isLast) {
      if (isLessThenMin) {
        value = 0;
      } else {
        value = isMoreThenMax ? 100 : this._selectedPerValue;
      }
    } else if (isFirst) {
      if (isLessThenMin) {
        value = 0;
      } else {
        value = isLessThenNext ? this._selectedPerValue : next;
      }
    } else if (isLast) {
      if (isMoreThenMax) {
        value = 100;
      } else {
        value = isMoreThenPrev ? this._selectedPerValue : prev;
      }
    } else if (isLessThenNext) {
      value = isMoreThenPrev ? this._selectedPerValue : prev;
    } else {
      value = next;
    }
    this._config.perValues[active] = value;
  }

  private _bindEventListeners() {
    document.addEventListener('pointerup', this._handleRelease.bind(this));
    window.addEventListener('resize', this._handleResize.bind(this));
  }
}

export { View, TViewConfig };
