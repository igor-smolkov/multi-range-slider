import { IBar } from '../Bar/Bar';
import { IViewHandler } from '../IView';

type TSlotConfig = {
  className: string,
  withIndent: boolean,
}

interface ISlot {
  update(config: TSlotConfig): void;
  getElem(): HTMLDivElement;
}

abstract class Slot implements ISlot {
  protected viewHandler: IViewHandler;

  protected isProcessed: boolean;

  protected bars: IBar[];

  protected slotElem: HTMLDivElement;

  protected className: string;

  private _withIndent: boolean;

  constructor(bars: IBar[], viewHandler: IViewHandler, options: TSlotConfig) {
    this.bars = bars;
    this.viewHandler = viewHandler;
    const config = { ...options };
    this.className = config.className;
    this._withIndent = config.withIndent;
    this._createElem();
    this._appendBars();
    this._configureElem();
    this.isProcessed = true;
    this._bindEventListeners();
  }

  public update(config: TSlotConfig): void {
    this._withIndent = config.withIndent;
    this._configureElem();
  }

  public getElem(): HTMLDivElement {
    return this.slotElem;
  }

  protected abstract handlePointerDown(e: MouseEvent): void;

  protected abstract handlePointerMove(e: MouseEvent): void;

  protected abstract isBeforeLastBar(clientCoordinate: number): boolean;

  protected abstract calcPerValue(clientCoordinate: number): number;

  protected abstract calcLengthPX(): number;

  protected abstract calcIndentPX(): number;

  protected activate(): void {
    this.isProcessed = false;
  }

  protected release(): void {
    this.isProcessed = true;
  }

  protected isBarProcessed(): boolean {
    return !this.bars.some((bar) => !bar.isProcessed());
  }

  protected calcInnerCoordinate(clientCoordinate :number): number {
    const innerCoordinate = clientCoordinate - this.calcIndentPX();
    return innerCoordinate >= 0 ? innerCoordinate : 0;
  }

  private _createElem() {
    const slotElem = document.createElement('div');
    slotElem.classList.add(this.className);
    this.slotElem = slotElem;
  }

  private _appendBars() {
    this.bars.forEach((bar) => this.slotElem.append(bar.getElem()));
  }

  private _configureElem() {
    if (!this._withIndent) { this.slotElem.style.margin = '0'; }
  }

  private _handlePointerUp() {
    if (this.isProcessed) return;
    this.release();
  }

  private _bindEventListeners() {
    this.slotElem.addEventListener('pointerdown', this.handlePointerDown.bind(this));
    document.addEventListener('pointermove', this.handlePointerMove.bind(this));
    document.addEventListener('pointerup', this._handlePointerUp.bind(this));
  }
}

export { ISlot, TSlotConfig, Slot };
