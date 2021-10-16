import $ from 'jquery';

import myJQuerySliderFactory from '../../jquery.my-jquery-slider/jquery.my-jquery-slider';

myJQuerySliderFactory($);

const parameters = [
  { min: 10, max: 20, value: 12 },
  { scale: 'numeric' },
  { withLabel: true },
];

$('.js-slider').each((index, slider) => {
  $(slider).myJQuerySlider(parameters[index]);
});
