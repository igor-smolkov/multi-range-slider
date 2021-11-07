import { IBar } from '../Bar/Bar';
import { IViewHandler } from '../IView';
import { Slot, TSlotConfig } from './Slot';

class VerticalSlot extends Slot {
  constructor(bars: IBar[], viewHandler: IViewHandler, options: TSlotConfig) {
    super(bars, viewHandler, options);
    this._markAsVertical();
  }

  public calcLengthPX(): number {
    return this.slotElem.getBoundingClientRect().height;
  }

  protected handlePointerDown(e :MouseEvent): void {
    this.activate();
    const isNeedToBarActivate = this.isBarProcessed() || !this.isBeforeLastBar(e.clientY);
    if (isNeedToBarActivate) this.bars[this.bars.length - 1].activate();
    this.viewHandler.handleSelectPerValue(this.calcPerValue(e.clientY));
  }

  protected handlePointerMove(e: MouseEvent): void {
    if (this.isProcessed) return;
    e.preventDefault();
    this.viewHandler.handleSelectPerValue(this.calcPerValue(e.clientY));
  }

  protected isBeforeLastBar(clientCoordinate: number): boolean {
    return clientCoordinate > this.bars[this.bars.length - 1].calcIndentPX();
  }

  protected calcPerValue(clientCoordinate: number): number {
    return 100 - ((this.calcInnerCoordinate(clientCoordinate) / this.calcLengthPX()) * 100);
  }

  protected calcIndentPX(): number {
    return this.slotElem.getBoundingClientRect().top;
  }

  private _markAsVertical() {
    this.slotElem.classList.add(`${this.className}_vertical`);
  }
}

export default VerticalSlot;
