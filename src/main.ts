import $ from 'jquery';
import 'normalize.css';

import multiRangeSliderFactory from './jquery.multi-range-slider/jquery.multi-range-slider';
import { MultiRangeSliderConfig, SliderScale } from './jquery.multi-range-slider/MultiRangeSliderConfig';
import SimpleDemo from './pages/simple-demo/SimpleDemo';

const parameters: MultiRangeSliderConfig[] = [
  {
    max: 50,
    value: 30,
    scale: SliderScale.numeric,
    withNotch: false,
  },
  {
    max: 50,
    value: 30,
    withLabel: true,
    scale: SliderScale.numeric,
    withNotch: false,
  },
  {
    min: -50,
    max: 50,
    value: 0,
    withLabel: true,
    scale: SliderScale.numeric,
    withNotch: false,
  },
  {
    max: 50,
    minInterval: 20,
    maxInterval: 30,
    withLabel: true,
    scale: SliderScale.numeric,
    withNotch: false,
  },
];

function start() {
  multiRangeSliderFactory($);

  const simpleDemos = [];
  $('.js-item').each((index, item) => {
    simpleDemos.push(new SimpleDemo(item, parameters[index]));
  });
}

window.addEventListener('load', start);
