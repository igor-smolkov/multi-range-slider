import { IViewHandler } from "./View";

type TSegmentConfig = {
  className: string;
  value: number;
  notch: 'short' | 'normal' | 'long';
  label?: number | string;
  grow?: number;
  isLast?: boolean;
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

  constructor(
    viewHandler: IViewHandler, 
    options: TSegmentConfig = {
      className: 'segment',
      value: 0,
      notch: 'normal',
    }
  ) {
    this._viewHandler = viewHandler;
    this._applyOptions(options);
    this._createElem();
    this._configurateElem();
  }
  public update(options: TSegmentConfig) {
    this._applyOptions(options);
    this._configurateElem();
  }
  public getElem() {
    return this._segmentElem;
  }
  private _applyOptions(options: TSegmentConfig) {
    const config = {...options};
    this._className = config.className;
    this._value = config.value;
    this._notch = config.notch;
    this._label = config.label ?? null;
    this._grow = config.grow ?? 1;
    this._isLast = config.isLast ?? false;
  }
  private _createElem() {
    const segmentElem = document.createElement('option');
    segmentElem.addEventListener('click', (e)=>this._handleClick(e))
    this._segmentElem = segmentElem;
  }
  private _configurateElem() {
    this._segmentElem.className = this._className;
    if (this._notch === 'long') {
      this._segmentElem.classList.add(`${this._className}_long`);
    } else if (this._notch === 'short') {
      this._segmentElem.classList.add(`${this._className}_short`);
    }
    this._segmentElem.value = this._value.toString();
    if (typeof(this._label) === 'number') {
      this._segmentElem.classList.add(`${this._className}_with-number`);
      this._segmentElem.label = this._label.toString();
    }
    if (typeof(this._label) === 'string') {
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
}

export { Segment, ISegment, TSegmentConfig }