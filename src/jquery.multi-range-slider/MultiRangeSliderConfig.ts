import { Config } from './Model/Model';

enum SliderEvent {
  init = 'init',
  update = 'update',
}

enum SliderOrientation {
  vertical = 'vertical',
  horizontal = 'horizontal',
}

enum SliderLabel {
  number = 'number',
  name = 'name',
}

enum SliderScale {
  basic = 'basic',
  numeric = 'numeric',
  named = 'named',
  mixed = 'mixed',
}

type MultiRangeSliderConfig = Partial<Config>;

export {
  MultiRangeSliderConfig, SliderOrientation, SliderLabel, SliderScale, SliderEvent,
};
