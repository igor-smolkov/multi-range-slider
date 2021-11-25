import $ from 'jquery';
import 'normalize.css';

import MainDemo from './pages/main-demo/MainDemo';
import myJQuerySliderFactory from './jquery.my-jquery-slider/jquery.my-jquery-slider';

function start() {
  myJQuerySliderFactory($);
  const demoPage = new MainDemo();
  demoPage.render();
}

window.addEventListener('load', start);
