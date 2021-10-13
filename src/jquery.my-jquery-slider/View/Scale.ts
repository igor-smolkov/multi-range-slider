import Corrector from '../Corrector';
import { ISegment } from './Segment';

type TScaleConfig = {
  className: string;
  withIndent: boolean;
}

type TScaleCalcReasonableStep = {
  max: number;
  min: number;
  step: number;
  maxLengthPx: number;
  isVertical: boolean;
  type: 'basic' | 'numeric' | 'named' | 'mixed';
  count?: number;
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

  private _withIndent: boolean;

  constructor(options: TScaleConfig) {
    this._init(options);
    this._createElem();
    this._configureElem();
  }

  public static calcReasonableStep(options: TScaleCalcReasonableStep): number {
    const config = { ...options };
    const range = config.max - config.min;
    let reasonableStep = config.step;
    const withCount = config.count && config.count > 0;
    if (withCount && config.count < range / config.step) {
      reasonableStep = range / config.count;
      return Corrector.makeCorrecterValueTailBy(config.step)(reasonableStep);
    }
    for (let i = 2; i < range / config.step; i += 1) {
      const resStepPerOfRange = (reasonableStep / range) * 100;
      if (resStepPerOfRange < 1) {
        reasonableStep = config.step * i;
      } else {
        break;
      }
    }
    let adaptiveStep = reasonableStep;
    for (let i = 1; i < config.maxLengthPx; i += 1) {
      const partOfRange = range / adaptiveStep;
      let grow = 1;
      if (config.type === 'numeric' || config.type === 'mixed') {
        grow = config.isVertical ? 2
          : (config.step.toString().length
            + config.max.toString().length
            + config.min.toString().length) / 2.75;
      }
      const per10OfLength = (config.maxLengthPx * 0.1) / grow;
      if (partOfRange > per10OfLength) {
        adaptiveStep = reasonableStep * i;
      } else {
        break;
      }
    }
    reasonableStep = adaptiveStep;
    reasonableStep = Corrector.makeCorrecterValueTailBy(config.step)(reasonableStep);
    return reasonableStep;
  }

  public update(options: TScaleConfig): void {
    this._init(options);
    this._configureElem();
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
    this._withIndent = config.withIndent;
  }

  private _createElem() {
    const scaleElem = document.createElement('datalist');
    this._scaleElem = scaleElem;
  }

  private _configureElem() {
    this._scaleElem.className = this._className;
    if (this._withIndent === false) { this._scaleElem.style.margin = '0'; }
  }

  private _appendSegments() {
    this._segments.forEach((segment) => this._scaleElem.append(segment.getElem()));
  }
}

export {
  Scale, IScale, TScaleConfig, TScaleCalcReasonableStep,
};
