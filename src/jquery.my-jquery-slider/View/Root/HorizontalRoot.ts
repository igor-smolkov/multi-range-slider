import { Root } from './Root';

class HorizontalRoot extends Root {
  protected calcLengthPx(): number {
    return this.rootElem.getBoundingClientRect().width;
  }

  protected drawOrientation(): void {
    this.rootElem.classList.remove(`${this.className}_vertical`);
  }

  protected drawLength(): void {
    const min = 105;
    this.rootElem.style.minWidth = '100%';
    this.rootElem.style.width = '100%';
    if (!this.lengthPx && this.slot.calcLengthPX() > min) return;
    const width = this.lengthPx > min ? `${this.lengthPx}px` : `${min}px`;
    this.rootElem.style.minWidth = width;
    this.rootElem.style.width = width;
  }
}

export default HorizontalRoot;
