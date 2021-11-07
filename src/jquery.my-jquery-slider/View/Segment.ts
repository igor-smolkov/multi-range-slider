import { IViewHandler } from './IView';

type TSegmentConfig = {
  className: string;
  value: number;
  notch: 'short' | 'normal' | 'long';
  label: number | string;
  grow: number;
  isLast: boolean;
  withNotch: boolean;
}

interface ISegment {
  update(options: TSegmentConfig): void;
  getElem(): HTMLDivElement;
}

class Segment implements ISegment {
  private _viewHandler: IViewHandler;

  private _segmentElem: HTMLDivElement;

  private _className: string;

  private _value: number;

  private _notch: 'short' | 'normal' | 'long';

  private _label: number | string;

  private _grow: number;

  private _isLast: boolean;

  private _withNotch: boolean;

  constructor(viewHandler: IViewHandler, options: TSegmentConfig) {
    this._viewHandler = viewHandler;
    this._applyOptions(options);
    this._createElem();
    this._configureElem();
    this._bindEventListeners();
  }

  public update(options: TSegmentConfig): void {
    this._applyOptions(options);
    this._configureElem();
  }

  public getElem(): HTMLDivElement {
    return this._segmentElem;
  }

  private _applyOptions(options: TSegmentConfig) {
    const config = { ...options };
    this._className = config.className;
    this._value = config.value;
    this._notch = config.notch;
    this._label = config.label;
    this._grow = config.grow;
    this._isLast = config.isLast;
    this._withNotch = config.withNotch;
  }

  private _createElem() {
    const segmentElem = document.createElement('div');
    segmentElem.setAttribute('tabindex', '0');
    this._segmentElem = segmentElem;
  }

  private _configureElem() {
    this._segmentElem.className = this._className;
    this._defineNotchModifier();
    this._defineLabelModifier();
    this._segmentElem.dataset.value = this._value.toString();
    this._segmentElem.style.flexGrow = this._grow.toString();
    if (this._isLast) this._segmentElem.classList.add(`${this._className}_last`);
  }

  private _defineNotchModifier() {
    if (this._withNotch) this._defineNotchLengthModifier();
    else this._segmentElem.classList.add(`${this._className}_notch_none`);
  }

  private _defineNotchLengthModifier() {
    if (this._notch === 'long') {
      this._segmentElem.classList.add(`${this._className}_long`);
    } else if (this._notch === 'short') {
      this._segmentElem.classList.add(`${this._className}_short`);
    }
  }

  private _defineLabelModifier() {
    if (typeof (this._label) === 'number') {
      this._segmentElem.classList.add(`${this._className}_with-number`);
      this._segmentElem.dataset.label = this._label.toString();
    }
    if (typeof (this._label) === 'string') {
      this._segmentElem.classList.add(`${this._className}_with-name`);
      this._segmentElem.dataset.label = this._label;
    }
  }

  private _handleClick(e :MouseEvent) {
    const option = e.target as HTMLDivElement;
    this._viewHandler.handleSelectValue(+option.dataset.value);
  }

  private _handleKeyPress(e: KeyboardEvent) {
    const option = e.target as HTMLDivElement;
    if (e.key === ' ') {
      e.preventDefault();
      this._viewHandler.handleSelectValue(+option.dataset.value);
    }
  }

  private _bindEventListeners() {
    this._segmentElem.addEventListener('click', this._handleClick.bind(this));
    this._segmentElem.addEventListener('keypress', this._handleKeyPress.bind(this));
  }
}

export { Segment, ISegment, TSegmentConfig };
