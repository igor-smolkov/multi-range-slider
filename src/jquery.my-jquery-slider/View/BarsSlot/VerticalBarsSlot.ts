import { IBar } from '../Bar/Bar';
import { IViewHandler } from '../IView';
import { BarsSlot, TBarsSlotConfig } from './BarsSlot';

class VerticalBarsSlot extends BarsSlot {
  constructor(
    bars: IBar[],
    viewHandler: IViewHandler,
    options: TBarsSlotConfig,
  ) {
    super(bars, viewHandler, options);
    this.markAsVertical();
  }

  public calcLengthPX(): number {
    return this.barsSlotElem.getBoundingClientRect().height;
  }

  protected handlePointerDown(e: MouseEvent): void {
    this.activate();
    const isNeedToBarActivate = this.isBarProcessed()
      || !this.isBeforeLastBar(e.clientY);
    if (isNeedToBarActivate) {
      this.bars[this.bars.length - 1].activate();
    }
    this.viewHandler.handleSelectPerValue(
      this.calcPerValue(e.clientY),
    );
  }

  protected handlePointerMove(e: MouseEvent): void {
    if (this.isProcessed) return;
    e.preventDefault();
    this.viewHandler.handleSelectPerValue(
      this.calcPerValue(e.clientY),
    );
  }

  protected isBeforeLastBar(clientCoordinate: number): boolean {
    const lastBar = this.bars[this.bars.length - 1];
    return clientCoordinate > lastBar.calcIndentPX();
  }

  protected calcPerValue(clientCoordinate: number): number {
    return (100
        - (this.calcInnerCoordinate(clientCoordinate)
        / this.calcLengthPX()) * 100
    );
  }

  protected calcIndentPX(): number {
    return this.barsSlotElem.getBoundingClientRect().top;
  }

  private markAsVertical() {
    this.barsSlotElem.classList.add(`${this.className}_vertical`);
  }
}

export default VerticalBarsSlot;
