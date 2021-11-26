import Corrector from '../Corrector';
import { ISegment } from './Segment';

type TScaleConfig = {
  className: string;
  withIndent: boolean;
};

type TScaleCalcReasonableStep = {
  max: number;
  min: number;
  step: number;
  maxLengthPx: number;
  isVertical: boolean;
  type: 'basic' | 'numeric' | 'named' | 'mixed';
  count?: number;
};

interface IScale {
  update(options: TScaleConfig): void;
  getElem(): HTMLDivElement;
  setSegments(segments: ISegment[]): void;
}

class Scale implements IScale {
  private _segments: ISegment[];

  private _scaleElem: HTMLDivElement;

  private _className: string;

  private _withIndent: boolean;

  constructor(options: TScaleConfig) {
    this._applyOptions(options);
    this._createElem();
    this._configureElem();
  }

  public static calcReasonableStep(
    options: TScaleCalcReasonableStep,
  ): number {
    const config = { ...options };
    const range = config.max - config.min;
    const withCount = config.count && config.count > 0;
    const isCustom = withCount && config.count < range / config.step;
    if (isCustom) {
      return Scale._calcCustomReasonableStep(
        range,
        config.count,
        config.step,
      );
    }
    const rangeStep = Scale._calcRangeStep(range, config.step);
    const adaptiveStep = Scale._calcAdaptiveStep(
      rangeStep,
      range,
      config,
    );
    return Corrector.makeCorrecterValueTailBy(config.step)(
      adaptiveStep,
    );
  }

  public update(options: TScaleConfig): void {
    this._applyOptions(options);
    this._configureElem();
  }

  public getElem(): HTMLDivElement {
    return this._scaleElem;
  }

  public setSegments(segments: ISegment[]): void {
    this._segments = segments;
    this._appendSegments();
  }

  private static _calcCustomReasonableStep(
    range: number,
    count: number,
    step: number,
  ): number {
    const reasonableStep = range / count;
    return Corrector.makeCorrecterValueTailBy(step)(reasonableStep);
  }

  private static _calcRangeStep(range: number, step: number): number {
    let rangeStep = step;
    for (let i = 2; i < range / step; i += 1) {
      const resStepPerOfRange = (rangeStep / range) * 100;
      if (resStepPerOfRange < 1) {
        rangeStep = step * i;
      } else {
        break;
      }
    }
    return rangeStep;
  }

  private static _calcAdaptiveStep(
    rangeStep: number,
    range: number,
    options: TScaleCalcReasonableStep,
  ): number {
    let adaptiveStep = rangeStep;
    for (let i = 1; i < options.maxLengthPx; i += 1) {
      const partOfRange = range / adaptiveStep;
      let grow = 1;
      const isTightSet = options.type === 'numeric'
        || options.type === 'mixed';
      if (isTightSet) {
        grow = options.isVertical ? 2
          : (options.step.toString().length
              + options.max.toString().length
              + options.min.toString().length) / 2.75;
      }
      const per10OfLength = (options.maxLengthPx * 0.1) / grow;
      if (partOfRange > per10OfLength) {
        adaptiveStep = rangeStep * i;
      } else break;
    }
    return adaptiveStep;
  }

  private _applyOptions(options: TScaleConfig) {
    const config = { ...options };
    this._className = config.className;
    this._withIndent = config.withIndent;
  }

  private _createElem() {
    const scaleElem = document.createElement('div');
    this._scaleElem = scaleElem;
  }

  private _configureElem() {
    this._scaleElem.className = this._className;
    if (this._withIndent === false) {
      this._scaleElem.style.margin = '0';
    }
  }

  private _appendSegments() {
    this._segments.forEach((segment) => (
      this._scaleElem.append(segment.getElem())
    ));
  }
}

export {
  Scale, IScale, TScaleConfig, TScaleCalcReasonableStep,
};
