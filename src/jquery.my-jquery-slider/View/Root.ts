import { IScale, Scale } from "./Scale";
import { HorizontalSlot, VerticalSlot, ISlot } from "./Slot";
import { IViewHandler, IViewConfigurator } from "./View";

type TRootConfig = {
  rootElem: HTMLElement;
  className: string;
  lengthPx?: number;
  indent?: 'none' | 'normal' | 'more';
}

interface IRoot {
  update(config?: TRootConfig): void;
  display(): void;
  calcLengthPx(): number;
  setScale(scale: IScale): void;
}

abstract class Root implements IRoot {
  protected slot: ISlot;
  
  protected viewHandler: IViewHandler;
  protected viewConfigurator: IViewConfigurator;

  protected rootElem: HTMLElement;
  protected className: string;
  protected lengthPx?: number;
  private indent?: 'none' | 'normal' | 'more';

  private _scale: IScale;

  constructor(options: TRootConfig = {
    rootElem: document.createElement('div'),
    className: 'my-jquery-slider',
    indent: 'normal',
  }, viewConfigurator: IViewConfigurator, viewHandler: IViewHandler) {
    this.viewConfigurator = viewConfigurator;
    this.viewHandler = viewHandler;
    const config = {...options};
    this.rootElem = config.rootElem;
    this.className = config.className;
    this.indent = config.indent ?? 'normal';
    this.lengthPx = config.lengthPx ?? null;
    this.initSlot();
  }

  public abstract calcLengthPx(): number;

  public update(config?: TRootConfig) {
    this.indent = config.indent ?? this.indent;
    this.lengthPx = config.lengthPx ?? this.lengthPx;
    if (this.slot) { this.slot.update(this.viewConfigurator.getSlotConfig()) }
    else { this.initSlot() }
    this._configurateElem();
  }
  public display() {
    this.rootElem.innerHTML = '';
    this.rootElem.className = this.className;
    this._addScale();
    this._addSlot();
    this._configurateElem();
  }
  public setScale(scale: IScale) {
    this._scale = scale;
  }

  protected abstract drawOrientation(): void;
  protected abstract drawLength(): void;
  protected abstract initSlot(): void;

  private _configurateElem() {
    this.drawOrientation();
    this.drawLength();
    this._drawIndents();
    this._listenResize();
  }
  private _drawIndents() {
    this._normalizeIndent();
    if (!this.indent) return;
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
  private _listenResize() {
    const length = this.calcLengthPx();
    const interval = setInterval(()=>{
        if(length !== this.calcLengthPx()) {
            clearInterval(interval);
            this.viewHandler.handleResize();
        }
    });
  }
}

class HorizontalRoot extends Root {
  public calcLengthPx() {
    const padding = this.rootElem.style.padding !== ''  ? parseInt(this.rootElem.style.padding, 10) : 15;
    const rootSizes = this.rootElem.getBoundingClientRect();
    return rootSizes.width - padding*2;
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
  protected initSlot() {
    this.slot = new HorizontalSlot(this.viewConfigurator.getSlotConfig(), this.viewConfigurator, this.viewHandler);
  }
}

class VerticalRoot extends Root {
  public calcLengthPx() {
    const padding = this.rootElem.style.padding !== ''  ? parseInt(this.rootElem.style.padding, 10) : 15;
    const rootSizes = this.rootElem.getBoundingClientRect();
    return rootSizes.height - padding*2;
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
  protected initSlot() {
    this.slot = new VerticalSlot(this.viewConfigurator.getSlotConfig(), this.viewConfigurator, this.viewHandler);
  }
}

export { HorizontalRoot, VerticalRoot, IRoot, TRootConfig }