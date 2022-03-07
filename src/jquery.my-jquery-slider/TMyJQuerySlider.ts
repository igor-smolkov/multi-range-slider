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

type TMyJQuerySlider = {
  min?: number | null;
  max?: number | null;
  value?: number | null;
  step?: number | null;
  orientation?: SliderOrientation;
  isDouble?: boolean | null;
  minInterval?: number | null;
  maxInterval?: number | null;
  limits?: number[] | null;
  activeRange?: number | null;
  withLabel?: boolean;
  label?: SliderLabel | null;
  scale?: SliderScale | null;
  scaleSegments?: number | null;
  withNotch?: boolean;
  labelsList?: (string | [number, string])[] | null;
  actualRanges?: number[] | null;
  lengthPx?: number | null;
  withIndent?: boolean;
};

export {
  TMyJQuerySlider, SliderOrientation, SliderLabel, SliderScale, SliderEvent,
};
