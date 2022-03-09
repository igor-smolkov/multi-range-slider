import { TRootConfig } from './Root/Root';
import { TBarsSlotConfig } from './BarsSlot/BarsSlot';
import { TBarConfig } from './Bar/Bar';
import { TLabelConfig } from './Label';
import { TThumbConfig } from './Thumb';
import { TScaleCalcReasonableStep, TScaleConfig } from './Scale';
import { TScaleSegmentConfig } from './ScaleSegment';
import { Changes, TViewConfig, ViewEvent } from './View';

interface IViewHandler {
  handleSelect(changes: Changes): void;
  handleStepForward(): void;
  handleStepBackward(): void;
}

interface IViewConfigurator {
  getRootConfig(): TRootConfig;
  getBarsSlotConfig(): TBarsSlotConfig;
  getBarConfigs(): TBarConfig[];
  getThumbConfig(id?: number): TThumbConfig;
  getLabelConfigs(): TLabelConfig[];
  getScaleConfig(): TScaleConfig;
  getScaleSegmentConfigs(
    calcReasonableStep?: (
      options: TScaleCalcReasonableStep,
    ) => number,
  ): TScaleSegmentConfig[];
}

interface IViewRender {
  render(config: TViewConfig): void;
  on(event: ViewEvent, callback: (changes?: Changes) => unknown): void;
}

export { IViewHandler, IViewConfigurator, IViewRender };
