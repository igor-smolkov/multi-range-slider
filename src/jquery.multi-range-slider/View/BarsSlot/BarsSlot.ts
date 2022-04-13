import { EventEmitter, IEventEmitter } from '../../EventEmitter';
import { IBar } from '../Bar/Bar';
import { Changes } from '../View';

enum BarsSlotEvent {
  change = 'change'
}

type TBarsSlotConfig = {
  className: string;
  withIndent: boolean;
};

interface IBarsSlot {
  on(event: BarsSlotEvent, callback: (changes?: Changes) => unknown): void;
  update(config: TBarsSlotConfig): void;
  getElem(): HTMLDivElement;
  calcLengthPX(): number;
}

abstract class BarsSlot implements IBarsSlot {
  private eventEmitter: IEventEmitter = new EventEmitter();

  protected isProcessed: boolean;

  protected bars: IBar[];

  protected barsSlotElem: HTMLDivElement;

  protected className?: string;

  private withIndent?: boolean;

  constructor(bars: IBar[], options: TBarsSlotConfig) {
    this.bars = bars;
    this.applyOptions(options);
    this.barsSlotElem = this.createElem();
    this.appendBars();
    this.isProcessed = true;
    this.configureElem();
    this.bindEventListeners();
  }

  public on(
    event: BarsSlotEvent, callback: (changes?: Changes) => unknown,
  ): void {
    this.eventEmitter.subscribe(event, callback);
  }

  public update(options: TBarsSlotConfig): void {
    this.applyOptions(options);
    this.configureElem();
  }

  public getElem(): HTMLDivElement {
    return this.barsSlotElem;
  }

  public abstract calcLengthPX(): number;

  protected abstract handlePointerDown(e: MouseEvent): void;

  protected abstract handlePointerMove(e: MouseEvent): void;

  protected abstract isBeforeLastBar(
    clientCoordinate: number,
  ): boolean;

  protected abstract calcPerValue(clientCoordinate: number): number;

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

  protected calcInnerCoordinate(clientCoordinate: number): number {
    const innerCoordinate = clientCoordinate - this.calcIndentPX();
    return innerCoordinate >= 0 ? innerCoordinate : 0;
  }

  protected notify(event: string, changes?: Changes): void {
    this.eventEmitter.emit(event, changes);
  }

  private applyOptions(options: TBarsSlotConfig) {
    const config = { ...options };
    this.className = config.className;
    this.withIndent = config.withIndent;
  }

  private createElem() {
    const barsSlotElem = document.createElement('div');
    barsSlotElem.classList.add(this.className as string);
    return barsSlotElem;
  }

  private appendBars() {
    this.bars.forEach((bar) => this.barsSlotElem.append(bar.getElem()));
  }

  private configureElem() {
    if (!this.withIndent) this.barsSlotElem.style.margin = '0';
    else this.barsSlotElem.removeAttribute('style');
  }

  private handlePointerUp() {
    if (this.isProcessed) return;
    this.release();
  }

  private bindEventListeners() {
    this.barsSlotElem.addEventListener(
      'pointerdown',
      this.handlePointerDown.bind(this),
    );
    document.addEventListener(
      'pointermove',
      this.handlePointerMove.bind(this),
    );
    document.addEventListener(
      'pointerup',
      this.handlePointerUp.bind(this),
    );
  }
}

export {
  IBarsSlot, TBarsSlotConfig, BarsSlot, BarsSlotEvent,
};
