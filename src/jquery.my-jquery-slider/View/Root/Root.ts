import { ISlot } from '../Slot/Slot';
import { IScale } from '../Scale';

enum RootIndent {
  none = 'none',
  normal = 'normal',
  more = 'more',
}

type TRootConfig = {
  className: string;
  lengthPx: number | null;
  indent: RootIndent;
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

  private indent?: RootIndent;

  private scale?: IScale;

  constructor(
    rootElem: HTMLElement,
    slot: ISlot,
    options: TRootConfig,
  ) {
    this.rootElem = rootElem;
    this.slot = slot;
    this.applyOptions(options);
  }

  public update(options: TRootConfig): void {
    this.applyOptions(options);
    this.configureElem();
  }

  public display(withFocus?: boolean): void {
    this.resetElem(withFocus);
    this.addScale();
    if (!withFocus) this.addSlot();
    this.configureElem();
  }

  public calcContentLengthPx(): number {
    const padding = this.rootElem.style.padding !== ''
      ? parseInt(this.rootElem.style.padding, 10) : 15;
    return this.calcLengthPx() - padding * 2;
  }

  public setScale(scale: IScale): void {
    if (this.scale) this.scale.getElem().remove();
    this.scale = scale;
  }

  protected abstract drawOrientation(): void;

  protected abstract drawLength(): void;

  protected abstract calcLengthPx(): number;

  private applyOptions(options: TRootConfig) {
    const config = { ...options };
    this.className = config.className;
    this.indent = config.indent;
    this.lengthPx = config.lengthPx as number;
  }

  private resetElem(isSoft?: boolean) {
    if (!isSoft) this.rootElem.innerHTML = '';
    this.rootElem.className = this.className as string;
    this.rootElem.removeAttribute('style');
  }

  private configureElem() {
    this.drawOrientation();
    this.drawLength();
    this.drawIndents();
  }

  private drawIndents() {
    this.normalizeIndent();
    if (this.indent === RootIndent.none) {
      this.removeIndent();
    }
    if (this.indent === RootIndent.more) {
      this.addIndent();
    }
  }

  private addIndent() {
    this.rootElem.classList.remove(`${this.className}_indent_none`);
    this.rootElem.classList.add(`${this.className}_indent_add`);
  }

  private normalizeIndent() {
    this.rootElem.classList.remove(`${this.className}_indent_add`);
    this.rootElem.classList.remove(`${this.className}_indent_none`);
  }

  private removeIndent() {
    this.rootElem.classList.remove(`${this.className}_indent_add`);
    this.rootElem.classList.add(`${this.className}_indent_none`);
  }

  private addScale() {
    if (!this.scale) return;
    this.rootElem.prepend(this.scale.getElem());
  }

  private addSlot() {
    this.rootElem.append(this.slot.getElem());
  }
}

export {
  IRoot, TRootConfig, Root, RootIndent,
};
