type TMyJQuerySlider = {
  min?: number | null;
  max?: number | null;
  value?: number | null;
  step?: number | null;
  orientation?: 'vertical' | 'horizontal';
  isDouble?: boolean | null;
  minInterval?: number | null;
  maxInterval?: number | null;
  limits?: number[] | null;
  active?: number | null;
  withLabel?: boolean;
  label?: 'number' | 'name' | null;
  scale?: 'basic' | 'numeric' | 'named' | 'mixed' | null;
  segments?: number | null;
  withNotch?: boolean;
  list?: (string | [number, string])[] | null;
  actualRanges?: number[] | null;
  lengthPx?: number | null;
  withIndent?: boolean;
};

export default TMyJQuerySlider;
