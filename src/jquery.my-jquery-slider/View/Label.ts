type TLabelConfig = {
  className: string;
  text: string;
}

interface ILabel {
  update(config: TLabelConfig): void;
  getElem(): HTMLDivElement;
}

class Label implements ILabel {
  private _labelElem: HTMLDivElement;

  private _className: string;

  private _text: string;

  constructor(options: TLabelConfig) {
    const config = { ...options };
    this._className = config.className;
    this._text = config.text;
    this._createElem();
    this._configureElem();
  }

  public update(config: TLabelConfig): void {
    this._text = config.text;
    this._configureElem();
  }

  public getElem(): HTMLDivElement {
    return this._labelElem;
  }

  private _createElem() {
    const labelElem = document.createElement('div');
    labelElem.classList.add(this._className);
    this._labelElem = labelElem;
  }

  private _configureElem() {
    this._labelElem.innerText = this._text;
  }
}

export { Label, ILabel, TLabelConfig };
