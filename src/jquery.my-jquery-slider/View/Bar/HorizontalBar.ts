import { Bar } from './Bar';

class HorizontalBar extends Bar {
  public calcIndentPX(): number {
    return this.barElem.getBoundingClientRect().left;
  }

  protected drawLengthPer(): void {
    this.barElem.style.width = `${this.lengthPer}%`;
  }
}

export default HorizontalBar;
