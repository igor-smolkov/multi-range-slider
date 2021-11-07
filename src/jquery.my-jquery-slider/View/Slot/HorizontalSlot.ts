import { Slot } from './Slot';

class HorizontalSlot extends Slot {
  public calcLengthPX(): number {
    return this.slotElem.getBoundingClientRect().width;
  }

  protected handlePointerDown(e: MouseEvent): void {
    this.activate();
    const isNeedToBarActivate = this.isBarProcessed() || !this.isBeforeLastBar(e.clientX);
    if (isNeedToBarActivate) this.bars[this.bars.length - 1].activate();
    this.viewHandler.handleSelectPerValue(this.calcPerValue(e.clientX));
  }

  protected handlePointerMove(e: MouseEvent): void {
    if (this.isProcessed) return;
    e.preventDefault();
    this.viewHandler.handleSelectPerValue(this.calcPerValue(e.clientX));
  }

  protected isBeforeLastBar(clientCoordinate: number): boolean {
    return clientCoordinate < this.bars[this.bars.length - 1].calcIndentPX();
  }

  protected calcPerValue(clientCoordinate: number): number {
    return (this.calcInnerCoordinate(clientCoordinate) / this.calcLengthPX()) * 100;
  }

  protected calcIndentPX(): number {
    return this.slotElem.getBoundingClientRect().left;
  }
}

export default HorizontalSlot;
