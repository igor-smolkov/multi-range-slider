import { BarsSlot, BarsSlotEvent } from './BarsSlot';

class HorizontalBarsSlot extends BarsSlot {
  public calcLengthPX(): number {
    return this.barsSlotElem.getBoundingClientRect().width;
  }

  protected handlePointerDown(e: MouseEvent): void {
    this.activate();
    const isNeedToBarActivate = this.isBarProcessed()
      || !this.isBeforeLastBar(e.clientX);
    if (isNeedToBarActivate) {
      this.bars[this.bars.length - 1].activate();
    }
    this.notify(BarsSlotEvent.change, { perValue: this.calcPerValue(e.clientX) });
  }

  protected handlePointerMove(e: MouseEvent): void {
    if (this.isProcessed) return;
    e.preventDefault();
    this.notify(BarsSlotEvent.change, { perValue: this.calcPerValue(e.clientX) });
  }

  protected isBeforeLastBar(clientCoordinate: number): boolean {
    const lastBar = this.bars[this.bars.length - 1];
    return clientCoordinate < lastBar.calcIndentPX();
  }

  protected calcPerValue(clientCoordinate: number): number {
    return ((this.calcInnerCoordinate(clientCoordinate)
      / this.calcLengthPX()) * 100
    );
  }

  protected calcIndentPX(): number {
    return this.barsSlotElem.getBoundingClientRect().left;
  }
}

export default HorizontalBarsSlot;
