import $ from 'jquery';
import './jquery.my-jquery-slider/jquery.my-jquery-slider';

import './style.scss';

import ConfigPanel from './components/config-panel/config-panel';
import TMyJQuerySlider from './jquery.my-jquery-slider/TMyJQuerySlider';

const showOptions = ($element: JQuery<HTMLElement>, options: TMyJQuerySlider) => {
  $element.html(JSON.stringify(options, null, 2));
};

function start() {
  const $input = $('.js-input');
  const $output = $('.js-output');
  const $slider = $('.js-slider');

  const configPanel = new ConfigPanel();

  const render = () => {
    const options = configPanel.getOptions();
    showOptions($input, options);
    $slider.myJQuerySlider(options);
  };

  configPanel.subscribe(render);

  const handleSliderChange = () => showOptions($output, $slider.data());
  $slider.on('my-jquery-slider-init', handleSliderChange);
  $slider.on('my-jquery-slider-update', handleSliderChange);

  render();
}
window.addEventListener('load', start);
