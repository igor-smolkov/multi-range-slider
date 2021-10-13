import { IThumb } from '../Thumb';

type TBarConfig = {
  className: string;
  id: number;
  lengthPer: number;
  indentPer: number;
  isActive: boolean;
  isActual: boolean;
  isEven: boolean;
}

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

  protected className: string;

  protected id: number;

  protected lengthPer: number;

  protected indentPer: number;

  private _isActive: boolean;

  private _isActual: boolean;

  private _isEven: boolean;

  private _isProcessed: boolean;

  constructor(thumb: IThumb, options: TBarConfig) {
    this.thumb = thumb;
    this._applyOptions(options);
    this._init();
    this._configureElem();
    this._bindEventListeners();
  }

  public abstract calcIndentPX(): number;

  public update(options: TBarConfig): void {
    this._applyOptions(options);
    this._configureElem();
    if (this._isActive) this._markActive();
  }

  public getElem(): HTMLDivElement {
    return this.barElem;
  }

  public isProcessed(): boolean {
    return this._isProcessed;
  }

  public activate(): void {
    if (this.thumb.isProcessed()) { this.thumb.activate(); }
    this._isProcessed = false;
    this._isActive = true;
    this._markActive();
  }

  protected abstract drawLengthPer(): void;

  private _applyOptions(options: TBarConfig) {
    const config = { ...options };
    this.className = config.className;
    this.id = config.id;
    this.lengthPer = config.lengthPer;
    this.indentPer = config.indentPer;
    this._isActive = config.isActive;
    this._isActual = config.isActual;
    this._isEven = config.isEven;
  }

  private _init() {
    this._createElem();
    this._appendThumb();
    this._isProcessed = true;
  }

  private _createElem() {
    const barElem = document.createElement('div');
    barElem.addEventListener('pointerdown', this._handlePointerDown.bind(this));
    this.barElem = barElem;
  }

  private _appendThumb() {
    this.barElem.append(this.thumb.getElem());
  }

  private _configureElem() {
    this.barElem.className = this.className;
    if (this._isActual) {
      this.barElem.classList.add(`${this.className}_actual`);
      if (this._isEven) {
        this.barElem.classList.add(`${this.className}_even`);
      }
    }
    this.drawLengthPer();
  }

  private _handlePointerDown() {
    this.activate();
  }

  private _handlePointerUp() {
    this._release();
  }

  private _release() {
    this._isProcessed = true;
    this._isActive = false;
    this._unMarkActive();
  }

  private _markActive() {
    if (!this._isActual) return;
    this.barElem.classList.add(`${this.className}_active`);
  }

  private _unMarkActive() {
    this.barElem.classList.remove(`${this.className}_active`);
  }

  private _bindEventListeners() {
    document.addEventListener('pointerup', this._handlePointerUp.bind(this));
  }
}

export { IBar, TBarConfig, Bar };
