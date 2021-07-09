type TSegment = {
  className: string;
  value: number;
  label: number | string;
  notch: 'short' | 'normal' | 'long';
  onClick?(value: number): void;
}

interface ISegment {
  getElem(): HTMLOptionElement;
  setGrow(value: number): void;
  markAsLast(): void;
  unmarkAsLast(): void;
}

class Segment implements ISegment {
  private _className: string;
  private _elem: HTMLOptionElement;
  private _onClick: Function;
  constructor(options: TSegment = {
    className: 'segment',
    value: 0,
    label: 0,
    notch: 'normal',
  }) {
    const config = {...options};
    this._className = config.className;
    this._elem = this._make(config);
    this._onClick = config.onClick;
  }
  public getElem() {
    return this._elem;
  }
  public setGrow(value: number) {
    this._elem.style.flexGrow = value.toString();
  }
  public markAsLast() {
    this._elem.classList.add(`${this._className}_last`);
  }
  public unmarkAsLast() {
    this._elem.classList.remove(`${this._className}_last`);
  }
  private _make(config: TSegment) {
    const elem = document.createElement('option');
    elem.classList.add(this._className);
    if (config.notch === 'long') {
      elem.classList.add(`${this._className}_long`);
    } else if (config.notch === 'short') {
      elem.classList.add(`${this._className}_short`);
    }
    if (typeof(config.label) === 'number') {
      elem.classList.add(`${this._className}_with-number`);
    }
    if (typeof(config.label) === 'string') {
      elem.classList.add(`${this._className}_with-name`);
    }
    elem.value = config.value.toString();
    elem.label = config.label.toString();
    elem.addEventListener('click', (e)=>this._handleClick(e))
    return elem;
  }
  private _handleClick(e :MouseEvent) {
    const option = e.target as HTMLOptionElement;
    if (!this._onClick) return;
    this._onClick(+option.value);
  }
}

export { Segment, ISegment }