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
    console.log('range', range, 'step', step, 'add', add, 'maxLengthPx', maxLengthPx);
    let resonableStep = step;
    // const rty = 100 / (range / step);
    // const qwe = 100 / (maxLengthPx / rty);
    // for (let i = 1; i < qwe; i++) {
    //   resonableStep += step;
    // }
    // console.log()
    for (let i = 2; i < range; i++) {
      const resStepPerOfRange = this._correcterValueTailBy(step)((resonableStep / range) * 100);
      const partOfRange = this._correcterValueTailBy(step)(range / resonableStep);
      const per10OfLength = this._correcterValueTailBy(step)(maxLengthPx * 0.1);
      if ((resStepPerOfRange < 1)
        ||(partOfRange > per10OfLength)) {
        resonableStep = this._correctValueByStep(step * i, step);
      } else {
        break;
      }
    }
    for (let i = 0; i < add; i++) {
      resonableStep *= i+2;
    }
    console.log('resonableStep before', resonableStep);
    resonableStep = this._correcterValueTailBy(step)(resonableStep);
    console.log('resonableStep after', resonableStep);
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
    // let per = config.maxLengthPx / (config.max-config.min);
    // let m = 1;
    // while (per < 50) {
    //   m++;
    //   per = (config.maxLengthPx / (config.max-config.min)) * m;
    // }
    // let i;
    // for (i = config.min; i <= config.max; i += config.step * m) {
    //   const label = config.list.has(i) ? config.list.get(i) : '';
    //   const length = i % (10*step) === 0 ? 'long' : 'normal';
    //   const segment = new Segment(this, `${config.className}__segment`, i, label, length, config.type);
    //   this._segments.push(segment);
    //   segment.setGrow(step);
    //   // if (i + config.step * m > config.max) {
    //   //   segment.setGrow(config.max - i);
    //   //   segment.setLast(true);
    //   // } else {
    //   //   segment.setGrow(step);
    //   // }
    // }
    // const segment = new Segment(this, `${config.className}__segment`, config.max, '', 'short', config.type);
    // this._segments.push(segment);
    // segment.setGrow(config.max - i);
    // segment.setLast(true);
    let acc;
    for(acc = config.min; acc <= config.max; acc += step) {
      acc = this._correcterValueTailBy(step)(acc);
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
    }
    this._segments.forEach(segment => scaleElem.append(segment.getElem()))
  }
  private _correctValueByStep(value: number, step: number) {
    return this._correcterValueTailBy(step)(Math.round(value * 1/step) * step);
}
  private _correcterValueTailBy(source: number) {
      const mantissa = source.toString().split('.')[1];
      // console.log('mantissa', mantissa)
      const mantissaLength = mantissa ? mantissa.length : 0;
      // console.log('mantissaLength', mantissaLength)
      return (value: number): number => +(value).toFixed(mantissaLength);
  }
}

export {Scale};