import { IScale } from "./IScale";
import { Segment } from "./Segment";
import { View } from "./View";

class Scale {
  private _view: View;
  private _elem: HTMLDataListElement;
  private _segments: Segment[];
  private _type: 'basic' | 'numeric' | 'named';
  constructor(config: IScale, view: View) {
    this._view = view;
    this._configurate(config);
  }
  public getElem() {
    return this._elem;
  }
  public getType() {
    return this._type;
  }
  public handleSegmentClick(value: number) {
    this._view.handleScaleClick(value);
  }
  private _configurate(config: IScale) {
    const addSpace = config.type === 'numeric' ? 1 : 0;
    const resonableStep = this._calcResonableStep(config.max-config.min, config.step, addSpace, config.maxLengthPx);
    this._elem = this._make(config, resonableStep);
    this._type = config.type;
  }
  private _calcResonableStep(range: number, step: number, add: number = 0, maxLengthPx: number) {
    let resonableStep = step;
    for (let i = 2; i < range; i++) {
      if ((resonableStep / range < 0.01)
        ||(range / resonableStep > maxLengthPx * 0.1)) {
        resonableStep = step * i;
      } else {
        break;
      }
    }
    for (let i = 0; i < add; i++) {
      resonableStep *= i+2;
    }
    return resonableStep;
  }
  private _make(config: IScale, step: number) {
    const scale = document.createElement('datalist');
    scale.classList.add(config.className);
    if (!config.withIndent && config.withIndent !== undefined) {
      scale.style.margin = '0';
    }
    this._appendSegments(config, scale, step);
    return scale;
  }
  private _appendSegments(config: IScale, scaleElem: HTMLDataListElement, step: number) {
    this._segments = [];
    let acc;
    for(acc = config.min; acc <= config.max; acc += step) {
      const label = config.list.has(acc) ? config.list.get(acc) : '';
      const length = acc % (10*step) === 0 ? 'long' : 'normal';
      const segment = new Segment(this, `${config.className}__segment`, acc, label, length, config.type);
      this._segments.push(segment);
      if (acc + step > config.max) {
        segment.setGrow(config.max - acc);
        segment.setLast(true);
      } else {
        segment.setGrow(step);
      }
      // segment.setGrow((acc + step > config.max) ? config.max - acc : step);
      // scaleElem.append(segment.getElem());
    }
    // if (acc - step !== config.max) {
    //   const label = config.list.has(config.max) ? config.list.get(config.max) : '';
    //   const segment = new Segment(this, `${config.className}__segment`, config.max, label, 'short', config.type);
    //   this._segments.pop();
    //   segment.setGrow((acc + step > config.max) ? config.max - acc : step);
    //   this._segments.push(segment);
    //   // scaleElem.append(segment.getElem());
    // }
    this._segments.forEach(segment => scaleElem.append(segment.getElem()))
  }
}

export {Scale};