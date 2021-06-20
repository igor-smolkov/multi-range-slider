class Label {
  private _elem: HTMLDivElement;
  private _className: string;
  private _type: 'number' | 'name';
  constructor(className: string = '', type: 'number' | 'name' = 'number') {
    this._className = className;
    this._type = type;
    this._elem = this._make();
  }
  public getElem() {
    return this._elem;
  }
  public show(value: number, name: string) {
    switch (this._type) {
      case 'number':
        this._elem.innerText = value.toString();
        return;
      case 'name':
        this._elem.innerText = name ?? value.toString();
        return;
    }
  }
  private _make() {
    const elem = document.createElement('div');
    elem.classList.add(`${this._className}__label`);
    return elem;
  }
}

export {Label}