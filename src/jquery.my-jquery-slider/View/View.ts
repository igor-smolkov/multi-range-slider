import './my-jquery-slider.scss';

import Corrector from '../Corrector';
import { IPresenter } from '../Presenter';
import { IRoot, TRootConfig } from './Root/Root';
import HorizontalRoot from './Root/HorizontalRoot';
import VerticalRoot from './Root/VerticalRoot';
import { IThumb, Thumb, TThumbConfig } from './Thumb';
import { IBar, TBarConfig } from './Bar/Bar';
import HorizontalBar from './Bar/HorizontalBar';
import VerticalBar from './Bar/VerticalBar';
import { ISlot, TSlotConfig } from './Slot/Slot';
import HorizontalSlot from './Slot/HorizontalSlot';
import VerticalSlot from './Slot/VerticalSlot';
import {
  TScaleConfig, Scale, TScaleCalcReasonableStep, IScale,
} from './Scale';
import { ISegment, Segment, TSegmentConfig } from './Segment';
import { ILabel, Label, TLabelConfig } from './Label';

type TViewConfig = {
  min: number;
  max: number;
  value: number;
  name: string;
  step: number;
  orientation: 'vertical' | 'horizontal';
  perValues: Array<number>;
  active: number;
  actualRanges: number[];
  list: Map<number, string>;
  withIndent: boolean;
  withLabel: boolean;
  label?: 'number' | 'name';
  scale?: 'basic' | 'numeric' | 'named';
  segments?: number;
  withNotch?: boolean;
  lengthPx?: number;
}

interface IViewHandler {
  handleSelectRange(index: number): void;
  handleSelectValue(value: number): void;
  handleSelectPerValue(perValue: number): void;
}

interface IViewConfigurator {
  getRootConfig(): TRootConfig;
  getSlotConfig(): TSlotConfig;
  getBarConfigs(): TBarConfig[];
  getThumbConfig(id?: number): TThumbConfig;
  getLabelConfig(): TLabelConfig;
  getScaleConfig(): TScaleConfig;
  getSegmentConfigs(
    calcReasonableStep?:(options: TScaleCalcReasonableStep) => number
  ): TSegmentConfig[];
}

interface IViewRender {
  render(config?: TViewConfig): void;
}

class View implements IViewHandler, IViewConfigurator, IViewRender {
  private _presenter: IPresenter;

  private _rootElem: HTMLElement;

  private _root: IRoot;

  private _slot: ISlot;

  private _bars: IBar[];

  private _thumbs: IThumb[];

  private _label: ILabel;

  private _scale: IScale;

  private _segments: ISegment[];

  private _className: string;

  private _config: TViewConfig;

  private _isProcessed: boolean;

  private _selectedPerValue: number;

  constructor(presenter: IPresenter, rootElem: HTMLElement, options: TViewConfig = {
    min: 0,
    max: 100,
    value: 50,
    name: '',
    step: 1,
    orientation: 'horizontal',
    perValues: [50],
    active: 0,
    actualRanges: [0],
    withLabel: false,
    list: new Map(),
    withIndent: true,
  }) {
    this._presenter = presenter;
    this._rootElem = rootElem;
    this._config = options;
    this._className = 'my-jquery-slider';
    this._isProcessed = true;
    this._bindEventListeners();
  }

  public render(options?: TViewConfig): void {
    if (this._hasPartialChanges(options)) {
      this._config = this._isProcessed
        ? options : { ...options, perValues: this._config.perValues };
      this._reRender();
      return;
    }
    this._config = options ?? this._config;
    this._selectedPerValue = this._config.perValues[this._config.active];
    this._makeSubViews();
    this._root.display();
  }

  public getRootConfig(): TRootConfig {
    let indent: 'none' | 'more' | 'normal' = 'none';
    if (this._config.withIndent) {
      indent = this._config.withLabel ? 'more' : 'normal';
    }
    const rootConfig: TRootConfig = {
      className: this._className,
      indent,
    };
    return rootConfig;
  }

  public getSlotConfig(): TSlotConfig {
    const slotConfig: TSlotConfig = {
      className: `${this._className}__slot`,
      withIndent: this._config.withIndent ?? true,
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
      withLabel: this._config.withLabel && this._config.active === id,
    };
    return thumbConfig;
  }

  public getLabelConfig(): TLabelConfig {
    const labelConfig: TLabelConfig = {
      className: `${this._className}__label`,
      text: this._config.label === 'name'
        ? this._config.name ?? this._config.value.toString()
        : this._config.value.toString(),
    };
    return labelConfig;
  }

  public getScaleConfig(): TScaleConfig {
    const scaleConfig: TScaleConfig = {
      className: `${this._className}__scale`,
      withIndent: this._config.withIndent ?? true,
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
      const label = this._config.list.has(acc) ? this._config.list.get(acc) : acc;
      segmentConfigs.push({
        className: `${this._className}__segment`,
        value: acc,
        notch: acc % (10 * reasonableStep) === 0 ? 'long' : 'normal',
        label: this._config.scale !== 'basic' ? label : null,
        grow: (acc + reasonableStep > this._config.max) ? (this._config.max - acc) : reasonableStep,
        isLast: acc === this._config.max,
        withNotch: this._config.withNotch ?? true,
      });
    }
    if (acc - reasonableStep !== this._config.max) {
      segmentConfigs.pop();
      const label = this._config.list.has(this._config.max)
        ? this._config.list.get(this._config.max) : null;
      segmentConfigs.push({
        className: `${this._className}__segment`,
        value: this._config.max,
        label: this._config.scale !== 'basic' ? label : null,
        notch: 'short',
        grow: this._config.max - (acc - reasonableStep),
        isLast: true,
        withNotch: this._config.withNotch ?? true,
      });
    }
    return segmentConfigs;
  }

  public handleSelectRange(index: number): void {
    if (!this._isProcessed) return;
    this._isProcessed = false;
    this._presenter.setActive(index);
  }

  public handleSelectValue(value :number): void {
    this._presenter.setActiveCloseOfValue(value);
    this._presenter.setValue(value);
  }

  public handleSelectPerValue(perValue: number): void {
    this._selectedPerValue = perValue;
    this._presenter.setPerValue(this._selectedPerValue);
  }

  private _handleRelease() {
    if (this._isProcessed) return;
    this._isProcessed = true;
    this._presenter.update();
  }

  private _handleResize() {
    this._reRender();
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
    this._label = new Label(this.getLabelConfig());
    this._thumbs = this._config.perValues.map(
      (_, index) => new Thumb(this._label, this, this.getThumbConfig(index)),
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
    this._scale = new Scale(this.getScaleConfig());
    this._segments = this.getSegmentConfigs(Scale.calcReasonableStep).map(
      (segmentConfig) => new Segment(this, segmentConfig),
    );
    this._scale.setSegments(this._segments);
    if (this._config.scale) { this._root.setScale(this._scale); }
  }

  private _updateSubViews() {
    this._label.update(this.getLabelConfig());
    this.getBarConfigs().forEach((barConfig, index) => {
      this._thumbs[index].update(this.getThumbConfig(index));
      this._bars[index].update(barConfig);
    });
    this._slot.update(this.getSlotConfig());
    this.getSegmentConfigs(Scale.calcReasonableStep).forEach(
      (segmentConfig, index) => this._segments[index].update(segmentConfig),
    );
    this._scale.update(this.getScaleConfig());
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

export {
  View, TViewConfig, IViewHandler, IViewConfigurator, IViewRender,
};
