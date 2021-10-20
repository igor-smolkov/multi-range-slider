import { Root } from './Root';

class VerticalRoot extends Root {
  protected calcLengthPx(): number {
    return this.rootElem.getBoundingClientRect().height;
  }

  protected drawOrientation(): void {
    this.rootElem.classList.add(`${this.className}_vertical`);
  }

  protected drawLength(): void {
    const min = 110;
    if (!this.lengthPx && this.slot.calcLengthPX() > min) return;
    const height = this.lengthPx > min ? `${this.lengthPx}px` : `${min}px`;
    this.rootElem.style.minHeight = height;
    this.rootElem.style.height = height;
  }
}

export default VerticalRoot;
