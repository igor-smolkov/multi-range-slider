import { Segment, ISegment } from "./Segment";

type TScale = {
  className: string;
  type: 'basic' | 'numeric' | 'named';
  min: number;
  max: number;
  step: number;
  list: Map<number, string>;
  maxLengthPx: number;
  withIndent: boolean;
  isVertical: boolean;
  onClick?(value: number): void;
}

interface IScale {
  getElem(): HTMLDataListElement;
}

class Scale implements IScale {
  private _elem: HTMLDataListElement;
  private _segments: ISegment[];
  private _type: 'basic' | 'numeric' | 'named';
  private _onClick: Function;
  constructor(options: TScale = {
    className: 'scale',
    type: 'basic',
    min: 0,
    max: 100,
    step: 10,
    list: new Map(),
    maxLengthPx: 500,
    withIndent: true,
    isVertical: false,
  }) {
    const config = {...options};
    this._configurate(config);
  }
  public getElem() {
    return this._elem;
  }
  private _configurate(config: TScale) {
    this._type = config.type;
    this._segments = this._makeSegments(config, this._calcResonableStep(config));
    this._elem = this._make(config);
    this._onClick = config.onClick;
  }
  private _calcResonableStep(config: TScale) {
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
  private _makeSegments(config: TScale, step: number) {
    const segments: ISegment[] = [];
    let acc;
    for(acc = config.min; acc <= config.max; acc += step) {
      acc = this._correcterValueTailBy(step)(acc);
      const label = config.list.has(acc) ? config.list.get(acc) : acc;
      const length = acc % (10*step) === 0 ? 'long' : 'normal';
      const segment = new Segment({
        className: `${config.className}__segment`,
        value: acc,
        label: config.type !== 'basic' ? label : null,
        notch: length,
        onClick: this._handleSegmentClick.bind(this),
      });
      segments.push(segment);
      segment.setGrow(step);
      if (acc + step > config.max) {
        segment.setGrow(config.max - acc);
      }
      if (acc === config.max) {
        segment.markAsLast();
      }
    }
    if (acc - step !== config.max) {
      segments.pop();
      const label = config.list.has(config.max) ? config.list.get(config.max) : '';
      const segment = new Segment({
        className: `${config.className}__segment`,
        value: config.max,
        label: config.type !== 'basic' ? label : null,
        notch: 'short',
        onClick: this._handleSegmentClick.bind(this),
      });
      segments.push(segment);
      segment.setGrow(config.max - (acc - step));
      segment.markAsLast();
    }
    return segments;
  }
  private _handleSegmentClick(value: number) {
    if (!this._onClick) return;
    this._onClick(value);
  }
  private _make(config: TScale) {
    const scale = document.createElement('datalist');
    scale.classList.add(config.className);
    if (!config.withIndent && config.withIndent !== undefined) {
      scale.style.margin = '0';
    }
    // this._segments = this._makeSegments(config, step);
    this._segments.forEach(segment => scale.append(segment.getElem()));
    return scale;
  }
  private _correcterValueTailBy(source: number) {
    const mantissa = source.toString().split('.')[1];
    const mantissaLength = mantissa ? mantissa.length : 0;
    return (value: number): number => +(value).toFixed(mantissaLength);
  }
}

export { Scale, IScale };