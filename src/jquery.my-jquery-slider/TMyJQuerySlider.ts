import { Config } from './Model/Model';

enum SliderEvent {
  init = 'my-jquery-slider-init',
  update = 'my-jquery-slider-update',
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

type TMyJQuerySlider = Partial<Config>;

export {
  TMyJQuerySlider, SliderOrientation, SliderLabel, SliderScale, SliderEvent,
};
