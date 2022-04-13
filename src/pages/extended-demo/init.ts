import $ from 'jquery';
import 'normalize.css';

import ExtendedDemo from './ExtendedDemo';
import multiRangeSliderFactory from '../../jquery.multi-range-slider/jquery.multi-range-slider';

function start() {
  multiRangeSliderFactory($);
  const demoPage = new ExtendedDemo();
  demoPage.render();
}

window.addEventListener('load', start);
