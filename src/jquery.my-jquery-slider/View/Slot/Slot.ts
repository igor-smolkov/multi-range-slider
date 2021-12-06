import { IBar } from '../Bar/Bar';
import { IViewHandler } from '../IView';

type TSlotConfig = {
  className: string;
  withIndent: boolean;
};

interface ISlot {
  update(config: TSlotConfig): void;
  getElem(): HTMLDivElement;
  calcLengthPX(): number;
}

abstract class Slot implements ISlot {
  protected viewHandler: IViewHandler;

  protected isProcessed: boolean;

  protected bars: IBar[];

  protected slotElem: HTMLDivElement;

  protected className?: string;

  private withIndent?: boolean;

  constructor(
    bars: IBar[],
    viewHandler: IViewHandler,
    options: TSlotConfig,
  ) {
    this.bars = bars;
    this.viewHandler = viewHandler;
    this.applyOptions(options);
    this.slotElem = this.createElem();
    this.appendBars();
    this.isProcessed = true;
    this.configureElem();
    this.bindEventListeners();
  }

  public update(options: TSlotConfig): void {
    this.applyOptions(options);
    this.configureElem();
  }

  public getElem(): HTMLDivElement {
    return this.slotElem;
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

  private applyOptions(options: TSlotConfig) {
    const config = { ...options };
    this.className = config.className;
    this.withIndent = config.withIndent;
  }

  private createElem() {
    const slotElem = document.createElement('div');
    slotElem.classList.add(this.className as string);
    return slotElem;
  }

  private appendBars() {
    this.bars.forEach((bar) => this.slotElem.append(bar.getElem()));
  }

  private configureElem() {
    if (!this.withIndent) this.slotElem.style.margin = '0';
    else this.slotElem.removeAttribute('style');
  }

  private handlePointerUp() {
    if (this.isProcessed) return;
    this.release();
  }

  private bindEventListeners() {
    this.slotElem.addEventListener(
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

export { ISlot, TSlotConfig, Slot };
