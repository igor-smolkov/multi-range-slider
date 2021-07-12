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
  display(): void;
  calcLengthPx(): number;
}

abstract class Root implements IRoot {
  protected slot: ISlot;
  protected _scale: IScale;
  
  protected viewHandler: IViewHandler;
  protected viewConfigurator: IViewConfigurator;

  protected rootElem: HTMLElement;
  protected className: string;
  protected lengthPx?: number;
  private indent?: 'none' | 'normal' | 'more';

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
    this._initScale();
    this.initSlot();
  }

  public abstract calcLengthPx(): number;

  public display() {
    this.rootElem.innerHTML = '';
    this.rootElem.classList.add(this.className);
    this.drawOrientation();
    this.drawLength();
    this._drawIndents();
    this._drawScale();
    this._drawSlot();
    this._listenResize();
  }

  protected abstract drawOrientation(): void;
  protected abstract drawLength(): void;
  protected abstract initSlot(): void;

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
  private _drawScale() {
    this.rootElem.append(this._scale.getElem());
  }
  private _drawSlot() {
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
  private _initScale() {
    this._scale = new Scale(this.viewConfigurator.getScaleConfig(), this.viewConfigurator, this.viewHandler);
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