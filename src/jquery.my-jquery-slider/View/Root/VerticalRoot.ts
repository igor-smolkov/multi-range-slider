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
    this.rootElem.style.minHeight = '100%';
    this.rootElem.style.height = '100%';
    const isDefault = !this.lengthPx
      && this.slot.calcLengthPX() > min;
    if (isDefault) return;
    const height = this.lengthPx && this.lengthPx > min
      ? `${this.lengthPx}px` : `${min}px`;
    this.rootElem.style.minHeight = height;
    this.rootElem.style.height = height;
  }
}

export default VerticalRoot;
