import $ from 'jquery';

import MainDemo from './pages/main-demo/main-demo';
import myJQuerySliderFactory from './jquery.my-jquery-slider/jquery.my-jquery-slider';

function start() {
  myJQuerySliderFactory($);
  const demoPage = new MainDemo();
  demoPage.render();
}

window.addEventListener('load', start);
