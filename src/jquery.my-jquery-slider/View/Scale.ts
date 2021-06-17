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
    this._type = config.type;
    const resonableStep = this._calcResonableStep(config);
    this._elem = this._make(config, resonableStep);
  }
  private _calcResonableStep(config: IScale) {
    const range = config.max-config.min;
    let resonableStep = config.step;
    for (let i = 2; i < range/config.step; i++) {
      const resStepPerOfRange = (resonableStep / range) * 100;
      if (resStepPerOfRange < 1) {
        resonableStep = config.step * i;
      } else {
        break;
      }
    }
    let adaptiveStep = resonableStep;
    for (let i = 1; i < config.maxLengthPx; i++) {
      const partOfRange = range / adaptiveStep;
      const grow = this._type === 'numeric' ? config.isVertical ? 2 : (config.step.toString().length+config.max.toString().length+config.min.toString().length)/3 : 1;
      const per10OfLength = config.maxLengthPx * 0.1 / grow;
      if (partOfRange > per10OfLength) {
        adaptiveStep = resonableStep * i;
      } else {
        break;
      }
    }
    resonableStep = adaptiveStep;
    resonableStep = this._correcterValueTailBy(config.step)(resonableStep);
    return resonableStep;
  }
  private _make(config: IScale, step: number) {
    const scale = document.createElement('datalist');
    scale.classList.add(config.className);
    if (!config.withIndent && config.withIndent !== undefined) {
      scale.style.margin = '0';
    }
    this._segments = this._makeSegments(config, step);
    this._segments.forEach(segment => scale.append(segment.getElem()));
    return scale;
  }
  private _makeSegments(config: IScale, step: number) {
    const segments: Segment[] = [];
    let acc;
    for(acc = config.min; acc <= config.max; acc += step) {
      acc = this._correcterValueTailBy(step)(acc);
      const label = config.list.has(acc) ? config.list.get(acc) : '';
      const length = acc % (10*step) === 0 ? 'long' : 'normal';
      const segment = new Segment(this, `${config.className}__segment`, acc, label, length, config.type);
      segments.push(segment);
      segment.setGrow(step);
      if (acc + step > config.max) {
        segment.setGrow(config.max - acc);
      }
      if (acc === config.max) {
        segment.setLast(true);
      }
    }
    if (acc - step !== config.max) {
      segments.pop();
      const label = config.list.has(config.max) ? config.list.get(config.max) : '';
      const segment = new Segment(this, `${config.className}__segment`, config.max, label, 'short', config.type);
      segments.push(segment);
      segment.setGrow(config.max - (acc - step));
      segment.setLast(true);
    }
    return segments;
  }
  private _correcterValueTailBy(source: number) {
    const mantissa = source.toString().split('.')[1];
    const mantissaLength = mantissa ? mantissa.length : 0;
    return (value: number): number => +(value).toFixed(mantissaLength);
  }
}

export {Scale};