import { Corrector } from "./Corrector";
import { Segment, ISegment } from "./Segment";
import { IViewConfigurator, IViewHandler } from "./View";

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
  getElem(): HTMLDataListElement;
}

class Scale implements IScale {
  private _viewHandler: IViewHandler;
  private _viewConfigurator: IViewConfigurator;

  private _segments: ISegment[];
  private _scaleElem: HTMLDataListElement;
  private _className: string;
  private _withIndent?: boolean;

  constructor(options: TScaleConfig = {
    className: 'scale',
    withIndent: true,
  }, viewConfigurator: IViewConfigurator, viewHandler: IViewHandler) {
    this._viewConfigurator = viewConfigurator;
    this._viewHandler = viewHandler;
    const config = {...options};
    this._className = config.className;
    this._withIndent = config.withIndent ?? true;
    this._initSegments();
    this._createElem();
  }
  public getElem() {
    return this._scaleElem;
  }
  private _initSegments() {
    const segments: ISegment[] = [];
    this._viewConfigurator.getSegmentConfigs()
      .forEach(segmentConfig => segments.push(new Segment(segmentConfig, this._viewHandler)));
    this._segments = segments;
  }
  private _createElem() {
    const scaleElem = document.createElement('datalist');
    scaleElem.classList.add(this._className);
    if (this._withIndent === false) { scaleElem.style.margin = '0'; }
    this._segments.forEach(segment => scaleElem.append(segment.getElem()));
    this._scaleElem = scaleElem;
  }
  public static calcResonableStep(options: TScaleCalcResonableStep) {
    const config = {...options}
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
      const grow = config.type === 'numeric' ? config.isVertical ? 2 : (config.step.toString().length+config.max.toString().length+config.min.toString().length)/3 : 1;
      const per10OfLength = config.maxLengthPx * 0.1 / grow;
      if (partOfRange > per10OfLength) {
        adaptiveStep = resonableStep * i;
      } else {
        break;
      }
    }
    resonableStep = adaptiveStep;
    resonableStep = Corrector.correcterValueTailBy(config.step)(resonableStep);
    return resonableStep;
  }
}

export { Scale, IScale, TScaleConfig, TScaleCalcResonableStep };