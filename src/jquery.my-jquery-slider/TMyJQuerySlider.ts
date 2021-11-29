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
  scale?: 'basic' | 'numeric' | 'named' | 'mixed' | null;
  segments?: number;
  withNotch?: boolean;
  list?: (string | [number, string])[];
  actualRanges?: number[] | null;
  lengthPx?: number;
  withIndent?: boolean;
};

export default TMyJQuerySlider;
