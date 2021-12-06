import { IThumb } from '../Thumb';

type TBarConfig = {
  className: string;
  id: number;
  lengthPer: number;
  indentPer: number;
  isActive: boolean;
  isActual: boolean;
  isEven: boolean;
};

interface IBar {
  update(config: TBarConfig): void;
  getElem(): HTMLDivElement;
  isProcessed(): boolean;
  activate(): void;
  calcIndentPX(): number;
}

abstract class Bar implements IBar {
  protected thumb: IThumb;

  protected barElem: HTMLDivElement;

  protected className?: string;

  protected id?: number;

  protected lengthPer?: number;

  protected indentPer?: number;

  private isActive?: boolean;

  private isActual?: boolean;

  private isEven?: boolean;

  private isProcessedLoc: boolean;

  constructor(thumb: IThumb, options: TBarConfig) {
    this.thumb = thumb;
    this.applyOptions(options);
    this.barElem = this.createElem();
    this.appendThumb();
    this.isProcessedLoc = true;
    this.configureElem();
    this.bindEventListeners();
  }

  public abstract calcIndentPX(): number;

  public update(options: TBarConfig): void {
    this.applyOptions(options);
    this.configureElem();
    if (this.isActive) this.markActive();
  }

  public getElem(): HTMLDivElement {
    return this.barElem;
  }

  public isProcessed(): boolean {
    return this.isProcessedLoc;
  }

  public activate(): void {
    if (this.thumb.isProcessed()) {
      this.thumb.activate();
    }
    this.isProcessedLoc = false;
    this.isActive = true;
    this.markActive();
  }

  protected abstract drawLengthPer(): void;

  private applyOptions(options: TBarConfig) {
    const config = { ...options };
    this.className = config.className;
    this.id = config.id;
    this.lengthPer = config.lengthPer;
    this.indentPer = config.indentPer;
    this.isActive = config.isActive;
    this.isActual = config.isActual;
    this.isEven = config.isEven;
  }

  private createElem() {
    const barElem = document.createElement('div');
    barElem.addEventListener(
      'pointerdown',
      this.handlePointerDown.bind(this),
    );
    return barElem;
  }

  private appendThumb() {
    this.barElem.append(this.thumb.getElem());
  }

  private configureElem() {
    this.barElem.className = this.className as string;
    if (this.isActual) this.defineBarModifier();
    this.drawLengthPer();
  }

  private defineBarModifier() {
    this.barElem.classList.add(`${this.className}_actual`);
    if (this.isEven) {
      this.barElem.classList.add(`${this.className}_even`);
    }
  }

  private handlePointerDown() {
    this.activate();
  }

  private handlePointerUp() {
    this.release();
  }

  private release() {
    this.isProcessedLoc = true;
    this.isActive = false;
    this.unMarkActive();
  }

  private markActive() {
    if (!this.isActual) return;
    this.barElem.classList.add(`${this.className}_active`);
  }

  private unMarkActive() {
    this.barElem.classList.remove(`${this.className}_active`);
  }

  private bindEventListeners() {
    document.addEventListener(
      'pointerup',
      this.handlePointerUp.bind(this),
    );
  }
}

export { IBar, TBarConfig, Bar };
