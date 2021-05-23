class Label {
  elem: HTMLDivElement;
  constructor(className: string = '') {
    this.elem = this._make(className);
  }
  public showValue(value: number, indent: number) {
    this.elem.dataset.value = value.toString();
    this.elem.style.paddingLeft = `${indent}px`
  }
  private _make(className: string = '') {
    const elem = document.createElement('div');
    elem.classList.add(`${className}__label`);
    return elem;
  }
}

export default Label