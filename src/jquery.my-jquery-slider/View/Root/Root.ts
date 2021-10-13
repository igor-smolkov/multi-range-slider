import { ISlot } from '../Slot/Slot';
import { IScale } from '../Scale';

type TRootConfig = {
  className: string;
  lengthPx: number;
  indent: 'none' | 'normal' | 'more';
}

interface IRoot {
  update(config: TRootConfig): void;
  display(): void;
  calcContentLengthPx(): number;
  setScale(scale: IScale): void;
}

abstract class Root implements IRoot {
  protected rootElem: HTMLElement;

  protected slot: ISlot;

  protected className: string;

  protected lengthPx?: number;

  private indent?: 'none' | 'normal' | 'more';

  private _scale: IScale;

  constructor(rootElem: HTMLElement, slot: ISlot, options: TRootConfig) {
    this.rootElem = rootElem;
    this.slot = slot;
    const config = { ...options };
    this.className = config.className;
    this.indent = config.indent;
    this.lengthPx = config.lengthPx;
  }

  public update(config: TRootConfig): void {
    this.indent = config.indent;
    this.lengthPx = config.lengthPx;
    this._configureElem();
  }

  public display(): void {
    this.rootElem.innerHTML = '';
    this.rootElem.className = this.className;
    this._addScale();
    this._addSlot();
    this._configureElem();
  }

  public calcContentLengthPx(): number {
    const padding = this.rootElem.style.padding !== '' ? parseInt(this.rootElem.style.padding, 10) : 15;
    return this.calcLengthPx() - padding * 2;
  }

  public setScale(scale: IScale): void {
    this._scale = scale;
  }

  protected abstract drawOrientation(): void;

  protected abstract drawLength(): void;

  protected abstract calcLengthPx(): number;

  private _configureElem() {
    this.drawOrientation();
    this.drawLength();
    this._drawIndents();
  }

  private _drawIndents() {
    this._normalizeIndent();
    if (this.indent === 'none') { this._removeIndent(); }
    if (this.indent === 'more') { this._addIndent(); }
  }

  private _addIndent() {
    this.rootElem.classList.remove(`${this.className}_indent_none`);
    this.rootElem.classList.add(`${this.className}_indent_add`);
  }

  private _normalizeIndent() {
    this.rootElem.classList.remove(`${this.className}_indent_add`);
    this.rootElem.classList.remove(`${this.className}_indent_none`);
  }

  private _removeIndent() {
    this.rootElem.classList.remove(`${this.className}_indent_add`);
    this.rootElem.classList.add(`${this.className}_indent_none`);
  }

  private _addScale() {
    if (!this._scale) return;
    this.rootElem.append(this._scale.getElem());
  }

  private _addSlot() {
    this.rootElem.append(this.slot.getElem());
  }
}

export { IRoot, TRootConfig, Root };
