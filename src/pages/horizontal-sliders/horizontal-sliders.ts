import $ from 'jquery';

import myJQuerySliderFactory from '../../jquery.my-jquery-slider/jquery.my-jquery-slider';

myJQuerySliderFactory($);

const parameters = [
  {
    min: 10, max: 20, value: 12,
  },
  { isDouble: true },
  {
    min: -1, max: 2, minInterval: -0.5, maxInterval: 0.7, step: 0.1, withLabel: true,
  },
  { limits: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170] },
  {
    limits: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170],
    actualRanges: [0, 2, 4, 6, 8, 10, 11, 12, 13, 14],
  },
  {
    withLabel: true, label: 'name', list: ['a', 'b', 'c', 'd', 'e', 'f', 'g'], value: 2,
  },
  { scale: 'basic' },
  { scale: 'numeric' },
  { scale: 'numeric', withNotch: false },
  { scale: 'numeric', segments: 4 },
  { scale: 'named', list: ['a', 'b', 'c', 'd', 'e', 'f', 'g'] },
  {
    scale: 'named', list: ['a', [-7.5, 'b'], [-1, 'c'], 'd', 'e', [8, 'f'], 'g'], min: -10, max: 10, value: 1, step: 0.5,
  },
  {
    scale: 'mixed', list: ['a', [-7.5, 'b'], [-1, 'c'], 'd', 'e', [8, 'f'], 'g'], min: -10, max: 10, value: 1, step: 0.5,
  },
  {
    scale: 'named', list: ['a', [-7.5, 'b'], [-1, 'c'], 'd', 'e', [8, 'f'], 'g'], min: -10, max: 10, value: 1, step: 0.5, withLabel: true, label: 'name',
  },
  { lengthPx: 250 },
  { withIndent: false, withLabel: true },
];

$('.js-slider').each((index, slider) => {
  $(slider).myJQuerySlider(parameters[index]);
});
