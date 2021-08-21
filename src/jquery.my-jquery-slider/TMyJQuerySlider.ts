type TMyJQuerySlider = {
  min?: number;
  max?: number;
  value?: number;
  step?: number;
  orientation?: 'vertical' | 'horizontal';
  isDouble?: boolean;
  minInterval?: number;
  maxInterval?: number;
  limits?: number[];
  active?: number;
  withLabel?: boolean;
  label?: 'number' | 'name';
  scale?: 'basic' | 'numeric' | 'named';
  list?: (string | [number, string])[];
  actuals?: number[];
  lengthPx?: number;
  withIndent?: boolean;
}

export default TMyJQuerySlider;
