import { IBar } from '../Bar/Bar';
import { IViewHandler } from '../View';
import { Slot, TSlotConfig } from './Slot';

class VerticalSlot extends Slot {
  constructor(bars: IBar[], viewHandler: IViewHandler, options?: TSlotConfig) {
    super(bars, viewHandler, options);
    this._markAsVertical();
  }

  protected handlePointerDown(e :MouseEvent): void {
    this.activate();
    if (this.isBarProcessed() || !this.isBeforeLastBar(e.clientY)) {
      this.bars[this.bars.length - 1].activate();
    }
    this.viewHandler.handleSelectPerValue(this.calcPerValue(e.clientY));
  }

  protected handlePointerMove(e: MouseEvent): void {
    if (this.isProcessed) return;
    e.preventDefault();
    this.viewHandler.handleSelectPerValue(this.calcPerValue(e.clientY));
  }

  protected isBeforeLastBar(clientCoord: number): boolean {
    return clientCoord > this.bars[this.bars.length - 1].calcIndentPX();
  }

  protected calcPerValue(clientCoord: number): number {
    return 100 - ((this.calcInnerCoord(clientCoord) / this.calcLengthPX()) * 100);
  }

  protected calcLengthPX(): number {
    return this.slotElem.getBoundingClientRect().height;
  }

  protected calcIndentPX(): number {
    return this.slotElem.getBoundingClientRect().top;
  }

  private _markAsVertical() {
    this.slotElem.classList.add(`${this.className}_vertical`);
  }
}

export default VerticalSlot;
