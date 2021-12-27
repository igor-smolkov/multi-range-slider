import { TRootConfig } from './Root/Root';
import { TSlotConfig } from './Slot/Slot';
import { TBarConfig } from './Bar/Bar';
import { TLabelConfig } from './Label';
import { TThumbConfig } from './Thumb';
import { TScaleCalcReasonableStep, TScaleConfig } from './Scale';
import { TSegmentConfig } from './Segment';
import { TViewConfig, ViewEvent } from './View';

interface IViewHandler {
  handleSelectRange(index: number): void;
  handleSelectValue(value: number): void;
  handleSelectPerValue(perValue: number): void;
  handleStepForward(): void;
  handleStepBackward(): void;
  handleFocus(index: number): void;
}

interface IViewConfigurator {
  getRootConfig(): TRootConfig;
  getSlotConfig(): TSlotConfig;
  getBarConfigs(): TBarConfig[];
  getThumbConfig(id?: number): TThumbConfig;
  getLabelConfigs(): TLabelConfig[];
  getScaleConfig(): TScaleConfig;
  getSegmentConfigs(
    calcReasonableStep?: (
      options: TScaleCalcReasonableStep,
    ) => number,
  ): TSegmentConfig[];
}

interface IViewRender {
  render(config: TViewConfig): void;
  on(event: ViewEvent, callback: () => unknown): void;
}

export { IViewHandler, IViewConfigurator, IViewRender };
