import { ISlot } from '../Slot/Slot';
import { IScale } from '../Scale';

type TRootConfig = {
  className: string;
  lengthPx: number | null;
  indent: 'none' | 'normal' | 'more';
};

interface IRoot {
  update(config: TRootConfig): void;
  display(withFocus?: boolean): void;
  calcContentLengthPx(): number;
  setScale(scale: IScale): void;
}

abstract class Root implements IRoot {
  protected rootElem: HTMLElement;

  protected slot: ISlot;

  protected className?: string;

  protected lengthPx?: number;

  private indent?: 'none' | 'normal' | 'more';

  private _scale?: IScale;

  constructor(
    rootElem: HTMLElement,
    slot: ISlot,
    options: TRootConfig,
  ) {
    this.rootElem = rootElem;
    this.slot = slot;
    this._applyOptions(options);
  }

  public update(options: TRootConfig): void {
    this._applyOptions(options);
    this._configureElem();
  }

  public display(withFocus?: boolean): void {
    this._resetElem(withFocus);
    this._addScale();
    if (!withFocus) this._addSlot();
    this._configureElem();
  }

  public calcContentLengthPx(): number {
    const padding = this.rootElem.style.padding !== ''
      ? parseInt(this.rootElem.style.padding, 10) : 15;
    return this.calcLengthPx() - padding * 2;
  }

  public setScale(scale: IScale): void {
    if (this._scale) this._scale.getElem().remove();
    this._scale = scale;
  }

  protected abstract drawOrientation(): void;

  protected abstract drawLength(): void;

  protected abstract calcLengthPx(): number;

  private _applyOptions(options: TRootConfig) {
    const config = { ...options };
    this.className = config.className;
    this.indent = config.indent;
    this.lengthPx = config.lengthPx as number;
  }

  private _resetElem(isSoft?: boolean) {
    if (!isSoft) this.rootElem.innerHTML = '';
    this.rootElem.className = this.className as string;
    this.rootElem.removeAttribute('style');
  }

  private _configureElem() {
    this.drawOrientation();
    this.drawLength();
    this._drawIndents();
  }

  private _drawIndents() {
    this._normalizeIndent();
    if (this.indent === 'none') {
      this._removeIndent();
    }
    if (this.indent === 'more') {
      this._addIndent();
    }
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
    this.rootElem.prepend(this._scale.getElem());
  }

  private _addSlot() {
    this.rootElem.append(this.slot.getElem());
  }
}

export { IRoot, TRootConfig, Root };
