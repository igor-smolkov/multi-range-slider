import Corrector from '../Corrector';
import { SliderScale } from '../TMyJQuerySlider';
import { IScaleSegment } from './ScaleSegment';

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
  type: SliderScale;
  count?: number;
};

interface IScale {
  update(options: TScaleConfig): void;
  getElem(): HTMLDivElement;
  setScaleSegments(scaleSegments: IScaleSegment[]): void;
}

class Scale implements IScale {
  private scaleSegments?: IScaleSegment[];

  private scaleElem: HTMLDivElement;

  private className?: string;

  private withIndent?: boolean;

  constructor(options: TScaleConfig) {
    this.applyOptions(options);
    this.scaleElem = Scale.createElem();
    this.configureElem();
  }

  public static calcReasonableStep(
    options: TScaleCalcReasonableStep,
  ): number {
    const config = { ...options };
    const range = config.max - config.min;
    const withCount = config.count && config.count > 0;
    const count = config.count ? config.count : null;
    const isCustom = withCount && count && count < range / config.step;
    if (isCustom) {
      return Scale.calcCustomReasonableStep(
        range,
        count as number,
        config.step,
      );
    }
    const rangeStep = Scale.calcRangeStep(range, config.step);
    const adaptiveStep = Scale.calcAdaptiveStep(
      rangeStep,
      range,
      config,
    );
    return Corrector.makeCorrecterValueTailBy(config.step)(
      adaptiveStep,
    );
  }

  public update(options: TScaleConfig): void {
    this.applyOptions(options);
    this.configureElem();
  }

  public getElem(): HTMLDivElement {
    return this.scaleElem;
  }

  public setScaleSegments(scaleSegments: IScaleSegment[]): void {
    this.scaleSegments = scaleSegments;
    this.appendScaleSegments();
  }

  private static createElem() {
    const scaleElem = document.createElement('div');
    return scaleElem;
  }

  private static calcCustomReasonableStep(
    range: number,
    count: number,
    step: number,
  ): number {
    const reasonableStep = range / count;
    return Corrector.makeCorrecterValueTailBy(step)(reasonableStep);
  }

  private static calcRangeStep(range: number, step: number): number {
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

  private static calcAdaptiveStep(
    rangeStep: number,
    range: number,
    options: TScaleCalcReasonableStep,
  ): number {
    let adaptiveStep = rangeStep;
    for (let i = 1; i < options.maxLengthPx; i += 1) {
      const partOfRange = range / adaptiveStep;
      let grow = 1;
      const isTightSet = options.type === SliderScale.numeric
        || options.type === SliderScale.mixed;
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

  private applyOptions(options: TScaleConfig) {
    const config = { ...options };
    this.className = config.className;
    this.withIndent = config.withIndent;
  }

  private configureElem() {
    this.scaleElem.className = this.className as string;
    if (this.withIndent === false) {
      this.scaleElem.style.margin = '0';
    }
  }

  private appendScaleSegments() {
    if (!this.scaleSegments) return;
    this.scaleSegments.forEach((scaleSegment) => (
      this.scaleElem.append(scaleSegment.getElem())
    ));
  }
}

export {
  Scale, IScale, TScaleConfig, TScaleCalcReasonableStep,
};
