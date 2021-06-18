class Label {
  private _elem: HTMLDivElement;
  private _runner: HTMLDivElement;
  private _className: string;
  constructor(className: string = '') {
    this._className = className;
    this._elem = this._make();
    this._runner = this._makeRunner();
    this._elem.append(this._runner);
  }
  public getElem() {
    return this._elem;
  }
  public showValue(value: number, indent: number) {
    this._runner.innerText = value.toString();
    this._runner.style.left = `${indent}px`;
    if (value.toString().length > 6) {
      this._runner.classList.add(`${this._className}__runner_wide`);
    } else {
      this._runner.classList.remove(`${this._className}__runner_wide`);
    }
  }
  private _make() {
    const elem = document.createElement('div');
    elem.classList.add(`${this._className}__label`);
    return elem;
  }
  private _makeRunner() {
    const elem = document.createElement('div');
    elem.classList.add(`${this._className}__runner`);
    return elem;
  }
}

export {Label}