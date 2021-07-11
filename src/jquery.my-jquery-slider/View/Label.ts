interface ILabel {
  getElem(): HTMLDivElement;
  show(value: number | string): void;
}

class Label implements ILabel {
  private _labelElem: HTMLDivElement;
  private _className: string;
  constructor(className = 'label') {
    this._className = className;
    this._createElem();
  }
  public getElem() {
    return this._labelElem;
  }
  public show(value: number | string) {
    this._labelElem.innerText = value.toString();
  }
  private _createElem() {
    const labelElem = document.createElement('div');
    labelElem.classList.add(this._className);
    this._labelElem = labelElem;
  }
}

export { Label, ILabel }