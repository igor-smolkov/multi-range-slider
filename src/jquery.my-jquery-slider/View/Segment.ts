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

  constructor(options: TSegmentConfig = {
    className: 'segment',
    value: 0,
    notch: 'normal',
  }, viewHandler: IViewHandler) {
    this._viewHandler = viewHandler;
    const config = {...options};
    this._className = config.className;
    this._value = config.value;
    this._notch = config.notch;
    this._label = config.label ?? null;
    this._grow = config.grow ?? 1;
    this._isLast = config.isLast ?? false;
    this._createElem();
  }
  public getElem() {
    return this._segmentElem;
  }
  private _createElem() {
    const segmentElem = document.createElement('option');
    segmentElem.classList.add(this._className);
    if (this._notch === 'long') {
      segmentElem.classList.add(`${this._className}_long`);
    } else if (this._notch === 'short') {
      segmentElem.classList.add(`${this._className}_short`);
    }
    segmentElem.value = this._value.toString();
    if (typeof(this._label) === 'number') {
      segmentElem.classList.add(`${this._className}_with-number`);
      segmentElem.label = this._label.toString();
    }
    if (typeof(this._label) === 'string') {
      segmentElem.classList.add(`${this._className}_with-name`);
      segmentElem.label = this._label;
    }
    segmentElem.style.flexGrow = this._grow.toString();
    if (this._isLast) {
      segmentElem.classList.add(`${this._className}_last`);
    }
    segmentElem.addEventListener('click', (e)=>this._handleClick(e))
    this._segmentElem = segmentElem;
  }
  private _handleClick(e :MouseEvent) {
    const option = e.target as HTMLOptionElement;
    this._viewHandler.handleSelectValue(+option.value);
  }
}

export { Segment, ISegment, TSegmentConfig }