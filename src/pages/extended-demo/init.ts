import $ from 'jquery';
import 'normalize.css';

import ExtendedDemo from './ExtendedDemo';
import myJQuerySliderFactory from '../../jquery.my-jquery-slider/jquery.my-jquery-slider';

function start() {
  myJQuerySliderFactory($);
  const demoPage = new ExtendedDemo();
  demoPage.render();
}

window.addEventListener('load', start);
