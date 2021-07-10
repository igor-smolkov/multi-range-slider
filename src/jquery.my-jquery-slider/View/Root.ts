import { HorizontalSlot, VerticalSlot, ISlot } from "./Slot";
import { TView, IViewHandler } from "./View";

interface IRoot {
  setDisplay(): void;
}

abstract class Root implements IRoot {

  protected viewHandler: IViewHandler;
  protected config: TView;
  protected slot: ISlot;
  protected rootElem: HTMLElement;
  protected className: string;  
  
  constructor(className: string, options: TView, viewHandler: IViewHandler) {
    this.className = className;
    this.viewHandler = viewHandler;
    this.config = {...options};
    this.rootElem = options.root;
    this.initSlot();
  }

  public setDisplay() {
    this.rootElem.classList.add(this.className);
    this.setOrientation();
    if (this.config.lengthPx) { this.setLengthPx(this.config.lengthPx) }
    this.setIndents(this.config);
    this.listenResize();
  }

  protected abstract initSlot(): void;

  protected setOrientation() {
    this.rootElem.classList.remove(`${this.className}_vertical`);
  }
  protected setLengthPx(lengthPx: number) {
    const width = lengthPx > 99 ? `${lengthPx}px` : '99px';
    this.rootElem.style.minWidth = width;
    this.rootElem.style.width = width;
  }
  protected getLengthPx() {
    const padding = this.rootElem.style.padding !== ''  ? parseInt(this.rootElem.style.padding, 10) : 15;
    const rootSizes = this.rootElem.getBoundingClientRect();
    return rootSizes.width - padding*2;
  }
  protected setIndents(config: TView) {
    this.normalizeIndent();
    if (!config.withIndent) { this.removeIndent() }
    const withLabelOnly = config.withLabel && !config.scale && config.withIndent;
    if (withLabelOnly) { this.addIndent() }
  }
  protected addIndent() {
    this.rootElem.classList.remove(`${this.className}_indent_none`);
    this.rootElem.classList.add(`${this.className}_indent_add`);
  }
  protected normalizeIndent() {
    this.rootElem.classList.remove(`${this.className}_indent_add`);
    this.rootElem.classList.remove(`${this.className}_indent_none`);
  }
  protected removeIndent() {
    this.rootElem.classList.remove(`${this.className}_indent_add`);
    this.rootElem.classList.add(`${this.className}_indent_none`);
  }
  protected listenResize() {
    const length = this.getLengthPx();
    const interval = setInterval(()=>{
        if(length !== this.getLengthPx()) {
            clearInterval(interval);
            this.viewHandler.handleUpdate();
        }
    });
  }
}

class HorizontalRoot extends Root {
  protected initSlot() {
    this.slot = new HorizontalSlot(this.config);
  }
}
class VerticalRoot extends Root {
  protected initSlot() {
    this.slot = new VerticalSlot(this.config);
  }
  protected setOrientation() {
    this.rootElem.classList.add(`${this.className}_vertical`);
  }
  protected setLengthPx(lengthPx: number) {
    const height = lengthPx > 80 ? `${lengthPx}px` : '80px';
    this.rootElem.style.minHeight = height;
    this.rootElem.style.height = height;
  }
  protected getLengthPx() {
    const padding = this.rootElem.style.padding !== ''  ? parseInt(this.rootElem.style.padding, 10) : 15;
    const rootSizes = this.rootElem.getBoundingClientRect();
    return rootSizes.height - padding*2;
  }
  protected setIndents(config: TView) {
    super.setIndents(config);
    const withFullset = config.withLabel && config.scale && config.withIndent;
    if (withFullset) { this.addIndent() }
  }
}

export { HorizontalRoot, VerticalRoot, IRoot }