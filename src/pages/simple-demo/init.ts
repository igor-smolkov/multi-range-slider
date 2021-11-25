import $ from 'jquery';
import 'normalize.css';

import myJQuerySliderFactory from '../../jquery.my-jquery-slider/jquery.my-jquery-slider';
import TMyJQuerySlider from '../../jquery.my-jquery-slider/TMyJQuerySlider';
import SimpleDemo from './SimpleDemo';

const parameters: TMyJQuerySlider[] = [
  {
    max: 50, value: 30, scale: 'numeric', withNotch: false,
  },
  {
    max: 50, value: 30, withLabel: true, scale: 'numeric', withNotch: false,
  },
  {
    min: -50, max: 50, value: 0, withLabel: true, scale: 'numeric', withNotch: false,
  },
  {
    max: 50, minInterval: 20, maxInterval: 30, withLabel: true, scale: 'numeric', withNotch: false,
  },
];

function start() {
  myJQuerySliderFactory($);

  const simpleDemos = [];
  $('.js-item').each((index, item) => {
    simpleDemos.push(new SimpleDemo(item, parameters[index]));
  });
}

window.addEventListener('load', start);
