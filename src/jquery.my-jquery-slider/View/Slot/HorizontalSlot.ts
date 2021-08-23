import { Slot } from './Slot';

class HorizontalSlot extends Slot {
  protected handlePointerDown(e: MouseEvent): void {
    this.activate();
    if (this.isBarProcessed() || !this.isBeforeLastBar(e.clientX)) {
      this.bars[this.bars.length - 1].activate();
    }
    this.viewHandler.handleSelectPerValue(this.calcPerValue(e.clientX));
  }

  protected handlePointerMove(e: MouseEvent): void {
    if (this.isProcessed) return;
    e.preventDefault();
    this.viewHandler.handleSelectPerValue(this.calcPerValue(e.clientX));
  }

  protected isBeforeLastBar(clientCoord: number): boolean {
    return clientCoord < this.bars[this.bars.length - 1].calcIndentPX();
  }

  protected calcPerValue(clientCoord: number): number {
    return (this.calcInnerCoord(clientCoord) / this.calcLengthPX()) * 100;
  }

  protected calcLengthPX(): number {
    return this.slotElem.getBoundingClientRect().width;
  }

  protected calcIndentPX(): number {
    return this.slotElem.getBoundingClientRect().left;
  }
}

export default HorizontalSlot;
