import Corrector from '../Corrector';
import { ISegment } from './Segment';

type TScaleConfig = {
  className: string;
  withIndent?: boolean;
}

type TScaleCalcResonableStep = {
  max: number;
  min: number;
  step: number;
  maxLengthPx: number;
  isVertical: boolean;
  type: 'basic' | 'numeric' | 'named';
}

interface IScale {
  update(options: TScaleConfig): void;
  getElem(): HTMLDataListElement;
  setSegments(segments: ISegment[]): void;
}

class Scale implements IScale {
  private _segments: ISegment[];

  private _scaleElem: HTMLDataListElement;

  private _className: string;

  private _withIndent?: boolean;

  constructor(options: TScaleConfig = { className: 'scale' }) {
    this._init(options);
    this._createElem();
    this._configurateElem();
  }

  public static calcResonableStep(options: TScaleCalcResonableStep): number {
    const config = { ...options };
    const range = config.max - config.min;
    let resonableStep = config.step;
    for (let i = 2; i < range / config.step; i += 1) {
      const resStepPerOfRange = (resonableStep / range) * 100;
      if (resStepPerOfRange < 1) {
        resonableStep = config.step * i;
      } else {
        break;
      }
    }
    let adaptiveStep = resonableStep;
    for (let i = 1; i < config.maxLengthPx; i += 1) {
      const partOfRange = range / adaptiveStep;
      let grow = 1;
      if (config.type === 'numeric') {
        grow = config.isVertical ? 2
          : (config.step.toString().length
            + config.max.toString().length
            + config.min.toString().length) / 3;
      }
      const per10OfLength = (config.maxLengthPx * 0.1) / grow;
      if (partOfRange > per10OfLength) {
        adaptiveStep = resonableStep * i;
      } else {
        break;
      }
    }
    resonableStep = adaptiveStep;
    resonableStep = Corrector.makeCorrecterValueTailBy(config.step)(resonableStep);
    return resonableStep;
  }

  public update(options: TScaleConfig): void {
    this._init(options);
    this._configurateElem();
  }

  public getElem(): HTMLDataListElement {
    return this._scaleElem;
  }

  public setSegments(segments: ISegment[]): void {
    this._segments = segments;
    this._appendSegments();
  }

  private _init(options: TScaleConfig) {
    const config = { ...options };
    this._className = config.className;
    this._withIndent = config.withIndent ?? true;
  }

  private _createElem() {
    const scaleElem = document.createElement('datalist');
    this._scaleElem = scaleElem;
  }

  private _configurateElem() {
    this._scaleElem.className = this._className;
    if (this._withIndent === false) { this._scaleElem.style.margin = '0'; }
  }

  private _appendSegments() {
    this._segments.forEach((segment) => this._scaleElem.append(segment.getElem()));
  }
}

export {
  Scale, IScale, TScaleConfig, TScaleCalcResonableStep,
};
