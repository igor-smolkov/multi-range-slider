import { IScale } from "./Scale";
import { ISlot } from "./Slot";

type TRootConfig = {
  className: string;
  lengthPx?: number;
  indent?: 'none' | 'normal' | 'more';
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

  constructor(
    rootElem: HTMLElement,
    slot: ISlot,
    options: TRootConfig = { className: 'my-jquery-slider' }
  ) {
    this.rootElem = rootElem;
    this.slot = slot;
    const config = {...options};
    this.className = config.className;
    this.indent = config.indent ?? 'normal';
    this.lengthPx = config.lengthPx ?? null;
  }

  public update(config: TRootConfig) {
    this.indent = config.indent ?? this.indent;
    this.lengthPx = config.lengthPx ?? this.lengthPx;
    this._configurateElem();
  }
  public display() {
    this.rootElem.innerHTML = '';
    this.rootElem.className = this.className;
    this._addScale();
    this._addSlot();
    this._configurateElem();
  }
  public calcContentLengthPx() {
    const padding = this.rootElem.style.padding !== ''  ? parseInt(this.rootElem.style.padding, 10) : 15;
    return this.calcLengthPx() - padding*2;
  }
  public setScale(scale: IScale) {
    this._scale = scale;
  }

  protected abstract drawOrientation(): void;
  protected abstract drawLength(): void;
  protected abstract calcLengthPx(): number;

  private _configurateElem() {
    this.drawOrientation();
    this.drawLength();
    this._drawIndents();
  }
  private _drawIndents() {
    this._normalizeIndent();
    if (this.indent === 'none') { this._removeIndent() };
    if (this.indent === 'more') { this._addIndent() }
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

class HorizontalRoot extends Root {
  protected calcLengthPx() {
    return this.rootElem.getBoundingClientRect().width;
  }
  protected drawOrientation() {
    this.rootElem.classList.remove(`${this.className}_vertical`);
  }
  protected drawLength() {
    if (!this.lengthPx) return;
    const width = this.lengthPx > 99 ? `${this.lengthPx}px` : '99px';
    this.rootElem.style.minWidth = width;
    this.rootElem.style.width = width;
  }
}

class VerticalRoot extends Root {
  protected calcLengthPx() {
    return this.rootElem.getBoundingClientRect().height;
  }
  protected drawOrientation() {
    this.rootElem.classList.add(`${this.className}_vertical`);
  }
  protected drawLength() {
    if (!this.lengthPx) return;
    const height = this.lengthPx > 80 ? `${this.lengthPx}px` : '80px';
    this.rootElem.style.minHeight = height;
    this.rootElem.style.height = height;
  }
}

export { HorizontalRoot, VerticalRoot, IRoot, TRootConfig, Root }