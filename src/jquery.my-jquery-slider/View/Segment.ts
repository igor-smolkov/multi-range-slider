import { Scale } from "./Scale";

class Segment {
  private _scale: Scale;
  private _elem: HTMLOptionElement;
  constructor(
    scale: Scale,
    className: string, 
    value: number, 
    label: string = '', 
    length: string = 'normal', 
    type: string = '',) {
    this._scale = scale;
    this._elem = this._make(className, value, label, length, type);
  }
  public getElem() {
    return this._elem;
  }
  public setGrow(value: number) {
    this._elem.style.flexGrow = value.toString();
  }
  private _make(className: string, value: number, label: string, length: string, type: string) {
    const elem = document.createElement('option');
    elem.classList.add(className);
    if (length === 'long') {
      elem.classList.add(`${className}_long`);
    } else if (length === 'short') {
      elem.classList.add(`${className}_short`);
    }
    if (type === 'numeric') {
      elem.classList.add(`${className}_with-value`);
    }
    if (type === 'named') {
      elem.classList.add(`${className}_with-label`);
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