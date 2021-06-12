import { Scale } from "./Scale";

class Segment {
  private _scale: Scale;
  private _className: string;
  private _elem: HTMLOptionElement;
  constructor(
    scale: Scale,
    className: string, 
    value: number, 
    label: string = '', 
    length: string = 'normal', 
    type: string = '',) {
    this._scale = scale;
    this._className = className;
    this._elem = this._make(value, label, length, type);
  }
  public getElem() {
    return this._elem;
  }
  public setGrow(value: number) {
    this._elem.style.flexGrow = value.toString();
  }
  public setLast(flag: boolean) {
    if (flag) {
      this._elem.classList.add(`${this._className}_last`);
    } else {
      this._elem.classList.remove(`${this._className}_last`);
    }
  }
  private _make(value: number, label: string, length: string, type: string) {
    const elem = document.createElement('option');
    elem.classList.add(this._className);
    if (length === 'long') {
      elem.classList.add(`${this._className}_long`);
    } else if (length === 'short') {
      elem.classList.add(`${this._className}_short`);
    }
    if (type === 'numeric') {
      elem.classList.add(`${this._className}_with-value`);
    }
    if (type === 'named') {
      elem.classList.add(`${this._className}_with-label`);
    }
    elem.value = value.toString();
    elem.label = label;
    elem.addEventListener('click', (e)=>this._handleClick(e))
    return elem;
  }
  private _handleClick(e :MouseEvent) {
    const option = e.target as HTMLOptionElement;
    this._scale.handleSegmentClick(+option.value);
  }
}

export {Segment}