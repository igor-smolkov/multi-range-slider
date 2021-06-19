class Label {
  private _elem: HTMLDivElement;
  private _className: string;
  constructor(className: string = '') {
    this._className = className;
    this._elem = this._make();
  }
  public getElem() {
    return this._elem;
  }
  public showValue(value: number) {
    this._elem.innerText = value.toString();
  }
  private _make() {
    const elem = document.createElement('div');
    elem.classList.add(`${this._className}__label`);
    return elem;
  }
}

export {Label}