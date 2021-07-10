import { Segment, ISegment } from "./Segment";

type TScale = {
  segments: ISegment[];
  className: string;
  type: 'basic' | 'numeric' | 'named';
  min: number;
  max: number;
  step: number;
  maxLengthPx: number;
  withIndent: boolean;
  isVertical: boolean;
}

interface IScale {
  getElem(): HTMLDataListElement;
  getResonableStep(): number;
}

class Scale implements IScale {
  private _elem: HTMLDataListElement;
  private _resonableStep: number;
  private _segments: ISegment[];
  private _type: 'basic' | 'numeric' | 'named';
  constructor(options: TScale = {
    segments: [new Segment()],
    className: 'scale',
    type: 'basic',
    min: 0,
    max: 100,
    step: 10,
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
  public getResonableStep() {
    return this._resonableStep;
  }
  private _configurate(config: TScale) {
    this._type = config.type;
    this._resonableStep = this._calcResonableStep(config);
    this._segments = config.segments;
    this._elem = this._make(config);
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
  // private _makeSegments(config: TScale, step: number) {
  //   const segments: Segment[] = [];
  //   let acc;
  //   for(acc = config.min; acc <= config.max; acc += step) {
  //     acc = this._correcterValueTailBy(step)(acc);
  //     const label = config.list ? config.list.has(acc) ? config.list.get(acc) : acc : null;
  //     const length = acc % (10*step) === 0 ? 'long' : 'normal';
  //     const segment = new Segment({
  //       className: `${config.className}__segment`,
  //       value: acc,
  //       label: config.type !== 'basic' ? label : null,
  //       notch: length,
  //       onClick: this.handleSegmentClick.bind(this),
  //     });
  //     segments.push(segment);
  //     segment.setGrow(step);
  //     if (acc + step > config.max) {
  //       segment.setGrow(config.max - acc);
  //     }
  //     if (acc === config.max) {
  //       segment.markAsLast();
  //     }
  //   }
  //   if (acc - step !== config.max) {
  //     segments.pop();
  //     const label = config.list ? config.list.has(config.max) ? config.list.get(config.max) : '' : null;
  //     const segment = new Segment({
  //       className: `${config.className}__segment`,
  //       value: config.max,
  //       label: config.type !== 'basic' ? label : null,
  //       notch: 'short',
  //       onClick: this.handleSegmentClick.bind(this),
  //     });
  //     segments.push(segment);
  //     segment.setGrow(config.max - (acc - step));
  //     segment.markAsLast();
  //   }
  //   return segments;
  // }
}

export { Scale, IScale };