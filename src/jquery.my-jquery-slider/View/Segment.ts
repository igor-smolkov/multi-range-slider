import { IViewHandler } from './View';

type TSegmentConfig = {
  className: string;
  value: number;
  notch: 'short' | 'normal' | 'long';
  label?: number | string;
  grow?: number;
  isLast?: boolean;
  withNotch?: boolean;
}

interface ISegment {
  update(options: TSegmentConfig): void;
  getElem(): HTMLOptionElement;
}

class Segment implements ISegment {
  private _viewHandler: IViewHandler;

  private _segmentElem: HTMLOptionElement;

  private _className: string;

  private _value: number;

  private _notch: 'short' | 'normal' | 'long';

  private _label: number | string;

  private _grow: number;

  private _isLast: boolean;

  private _withNotch: boolean;

  constructor(
    viewHandler: IViewHandler,
    options: TSegmentConfig = {
      className: 'segment',
      value: 0,
      notch: 'normal',
    },
  ) {
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

  public getElem(): HTMLOptionElement {
    return this._segmentElem;
  }

  private _applyOptions(options: TSegmentConfig) {
    const config = { ...options };
    this._className = config.className;
    this._value = config.value;
    this._notch = config.notch;
    this._label = config.label ?? null;
    this._grow = config.grow ?? 1;
    this._isLast = config.isLast ?? false;
    this._withNotch = config.withNotch ?? true;
  }

  private _createElem() {
    const segmentElem = document.createElement('option');
    this._segmentElem = segmentElem;
  }

  private _configureElem() {
    this._segmentElem.className = this._className;
    if (this._withNotch) {
      if (this._notch === 'long') {
        this._segmentElem.classList.add(`${this._className}_long`);
      } else if (this._notch === 'short') {
        this._segmentElem.classList.add(`${this._className}_short`);
      }
    } else {
      this._segmentElem.classList.add(`${this._className}_notch_none`);
    }
    this._segmentElem.value = this._value.toString();
    if (typeof (this._label) === 'number') {
      this._segmentElem.classList.add(`${this._className}_with-number`);
      this._segmentElem.label = this._label.toString();
    }
    if (typeof (this._label) === 'string') {
      this._segmentElem.classList.add(`${this._className}_with-name`);
      this._segmentElem.label = this._label;
    }
    this._segmentElem.style.flexGrow = this._grow.toString();
    if (this._isLast) {
      this._segmentElem.classList.add(`${this._className}_last`);
    }
  }

  private _handleClick(e :MouseEvent) {
    const option = e.target as HTMLOptionElement;
    this._viewHandler.handleSelectValue(+option.value);
  }

  private _bindEventListeners() {
    this._segmentElem.addEventListener('click', this._handleClick.bind(this));
  }
}

export { Segment, ISegment, TSegmentConfig };
