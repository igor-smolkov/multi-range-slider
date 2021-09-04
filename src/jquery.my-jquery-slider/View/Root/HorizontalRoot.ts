import { Root } from './Root';

class HorizontalRoot extends Root {
  protected calcLengthPx(): number {
    return this.rootElem.getBoundingClientRect().width;
  }

  protected drawOrientation(): void {
    this.rootElem.classList.remove(`${this.className}_vertical`);
  }

  protected drawLength(): void {
    if (!this.lengthPx) return;
    const width = this.lengthPx > 99 ? `${this.lengthPx}px` : '99px';
    this.rootElem.removeAttribute('style');
    this.rootElem.style.minWidth = width;
    this.rootElem.style.width = width;
  }
}

export default HorizontalRoot;
