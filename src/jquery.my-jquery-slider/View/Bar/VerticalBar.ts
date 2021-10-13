import { IThumb } from '../Thumb';
import { Bar, TBarConfig } from './Bar';

class VerticalBar extends Bar {
  constructor(thumb: IThumb, options: TBarConfig) {
    super(thumb, options);
    this._markAsVertical();
  }

  public calcIndentPX(): number {
    return this.barElem.getBoundingClientRect().top;
  }

  protected drawLengthPer(): void {
    this.barElem.style.height = `${this.lengthPer}%`;
  }

  private _markAsVertical(): void {
    this.barElem.classList.add(`${this.className}_vertical`);
  }
}

export default VerticalBar;
