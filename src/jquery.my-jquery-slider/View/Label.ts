interface ILabel {
  getElem(): HTMLDivElement;
  show(value: number | string): void;
}

class Label implements ILabel {
  private _elem: HTMLDivElement;
  private _className: string;
  constructor(className = 'label') {
    this._className = className;
    this._elem = this._make();
  }
  public getElem() {
    return this._elem;
  }
  public show(value: number | string) {
    this._elem.innerText = value.toString();
  }
  private _make() {
    const elem = document.createElement('div');
    elem.classList.add(this._className);
    return elem;
  }
}

export { Label, ILabel }