import { Root } from './Root';

class VerticalRoot extends Root {
  protected calcLengthPx(): number {
    return this.rootElem.getBoundingClientRect().height;
  }

  protected drawOrientation(): void {
    this.rootElem.classList.add(`${this.className}_vertical`);
  }

  protected drawLength(): void {
    if (!this.lengthPx) return;
    const height = this.lengthPx > 80 ? `${this.lengthPx}px` : '80px';
    this.rootElem.style.minHeight = height;
    this.rootElem.style.height = height;
  }
}

export default VerticalRoot;
