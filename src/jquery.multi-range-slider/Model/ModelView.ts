import { SliderLabel, SliderOrientation, SliderScale } from '../MultiRangeSliderConfig';

type ModelViewConfig = {
  orientation: SliderOrientation;
  withLabel: boolean,
  withIndent: boolean,
  withNotch: boolean,
  label: SliderLabel | null,
  scale: SliderScale | null,
  scaleSegments: number | null,
  lengthPx: number | null,
}

interface IModelView {
  update(options?: Partial<ModelViewConfig>): void;
  getConfig(): ModelViewConfig;
}

class ModelView implements IModelView {
  private defaults: ModelViewConfig = {
    orientation: SliderOrientation.horizontal,
    withLabel: false,
    withIndent: true,
    withNotch: true,
    label: null,
    scale: null,
    scaleSegments: null,
    lengthPx: null,
  }

  private config: ModelViewConfig;

  constructor(options?: Partial<ModelViewConfig>) {
    this.config = { ...this.defaults, ...options };
  }

  public update(options?: Partial<ModelViewConfig>): void {
    this.config = { ...this.config, ...options };
  }

  public getConfig(): ModelViewConfig {
    return { ...this.config };
  }
}

export { IModelView, ModelViewConfig, ModelView };
