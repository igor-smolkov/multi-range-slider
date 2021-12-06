type TLabelConfig = {
  className: string;
  text: string;
};

interface ILabel {
  update(config: TLabelConfig): void;
  getElem(): HTMLDivElement;
}

class Label implements ILabel {
  private labelElem: HTMLDivElement;

  private className?: string;

  private text?: string;

  constructor(options: TLabelConfig) {
    this.applyOptions(options);
    this.labelElem = this.createElem();
    this.configureElem();
  }

  public update(options: TLabelConfig): void {
    this.applyOptions(options);
    this.configureElem();
  }

  public getElem(): HTMLDivElement {
    return this.labelElem;
  }

  private applyOptions(options: TLabelConfig) {
    const config = { ...options };
    this.className = config.className;
    this.text = config.text;
  }

  private createElem() {
    const labelElem = document.createElement('div');
    labelElem.classList.add(this.className as string);
    return labelElem;
  }

  private configureElem() {
    this.labelElem.innerText = this.text as string;
  }
}

export { Label, ILabel, TLabelConfig };
