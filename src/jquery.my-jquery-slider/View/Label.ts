class Label {
  private _elem: HTMLDivElement;
  constructor(className: string = '') {
    this._elem = this._make(className);
  }
  public getElem() {
    return this._elem;
  }
  public showValue(value: number, indent: number) {
    this._elem.dataset.value = value.toString();
    this._elem.style.paddingLeft = `${indent}px`
  }
  private _make(className: string = '') {
    const elem = document.createElement('div');
    elem.classList.add(`${className}__label`);
    return elem;
  }
}

export {Label}